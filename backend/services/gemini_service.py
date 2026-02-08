from google import genai
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Gemini from environment variable
class GeminiService:
    def __init__(self):
        # Load all available keys
        self.api_keys = [
            os.environ.get("GEMINI_API_KEY"),
            os.environ.get("GEMINI_API_KEY_2"),
            os.environ.get("GEMINI_API_KEY_3")
        ]
        # Filter out None values
        self.api_keys = [key for key in self.api_keys if key]
        
        self.current_key_index = 0
        self.client = None
        self.model_name = "gemini-2.0-flash"
        self.fallback_model = "gemini-2.5-flash"

        self._initialize_client()

        # System instruction to enforce agriculture domain
        self.system_prompt = """
        You are an intelligent agricultural assistant for the 'Agro360' smart farming platform.
        Your role is to assist farmers with questions related to:
        - Crop management and selection
        - Fertilizer application and nutrients
        - Soil health and analysis
        - Plant disease detection and treatment
        - Weather advisory and sowing timing
        - General farming best practices

        CRITICAL CONSTRAINTS:
        1. IF a user asks about anything unrelated to agriculture, farming, weather, or the app's features (like movies, politics, coding, general trivia), you must POLITELY REFUSE.
           Example refusal: "I apologize, but I am designed only to assist with farming and agriculture related queries."
        2. Keep answers concise, practical, and easy to understand for a farmer.
        3. You must support multiple languages. If the user input is in a specific language (like Hindi, Telugu, Tamil, etc.), you MUST reply in that SAME language.
        4. Provide the response as a JSON object with this structure:
           {
             "response": "The spoken/text response to the user",
             "intent": "general_query" or specific intent like "navigate_crop", "navigate_disease" if applicable,
             "language_detected": "en" or "hi", etc.
           }
        """

    def _initialize_client(self):
        """Initialize or re-initialize the client with the current key"""
        if not self.api_keys:
            print("WARNING: No GEMINI_API_KEYs found. AI features will be disabled.")
            self.client = None
            return

        current_key = self.api_keys[self.current_key_index]
        try:
            self.client = genai.Client(api_key=current_key)
            print(f"Successfully initialized Gemini client with key index {self.current_key_index} and model: {self.model_name}")
        except Exception as e:
            print(f"Failed to initialize Gemini client with key index {self.current_key_index}: {e}")
            self._rotate_key()

    def _rotate_key(self):
        """Switch to the next available API key"""
        if not self.api_keys or len(self.api_keys) <= 1:
            print("No backup keys available to rotate.")
            return False
            
        prev_index = self.current_key_index
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        
        print(f"Rotating API key from index {prev_index} to {self.current_key_index}...")
        self._initialize_client()
        return True
    

    def process_farming_intent(self, text, language='en'):
        if not self.client:
            return {
                "response": "AI service is not configured. Please check API key.", 
                "intent": "error",
                "success": False
            }
        try:
            # Construct the prompt with context
            full_prompt = f"""
            {self.system_prompt}
            
            Current User Language Preference: {language}
            User Query: {text}
            
            Respond in valid JSON format only.
            """
            
            # Retry logic with key rotation
            max_retries = len(self.api_keys) * 2  # Allow for a full rotation + model fallback
            
            for attempt in range(max_retries):
                try:
                    # Try with current configuration
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=full_prompt
                    )
                    
                    # Clean up response to ensure valid JSON
                    response_text = response.text.strip()
                    if response_text.startswith('```json'):
                        response_text = response_text[7:-3]
                    elif response_text.startswith('```'):
                        response_text = response_text[3:-3]
                        
                    return json.loads(response_text)
                except Exception as e:
                    print(f"Primary model {self.model_name} failed: {e}. Trying fallback {self.fallback_model}...")
                    try:
                        response = self.client.models.generate_content(
                            model=self.fallback_model,
                            contents=full_prompt
                        )
                        
                        # Clean up response to ensure valid JSON
                        response_text = response.text.strip()
                        if response_text.startswith('```json'):
                            response_text = response_text[7:-3]
                        elif response_text.startswith('```'):
                            response_text = response_text[3:-3]
                            
                        return json.loads(response_text)
                    except Exception as fallback_e:
                        print(f"Fallback model failed: {fallback_e}")
                        
                        # Check for quota/resource exhaustion on either attempt
                        error_str = str(e)
                        fallback_error_str = str(fallback_e)
                        
                        if ("429" in error_str or "RESOURCE_EXHAUSTED" in error_str or 
                            "429" in fallback_error_str or "RESOURCE_EXHAUSTED" in fallback_error_str):
                            print(f"Quota exceeded on key index {self.current_key_index}. Rotating key...")
                            if self._rotate_key():
                                continue # Retry with new key

                    # If we're here, this attempt failed completely
                    if attempt == max_retries - 1:
                        raise e # Re-raise last exception if out of retries

        except Exception as e:
            print(f"Gemini API Error: {e}")
            return {
                "response": "I'm having trouble connecting to the farm network right now. Please try again.", 
                "intent": "error",
                "success": False
            }

    def generate_response(self, prompt):
        """
        Generic method to generate content from Gemini based on a prompt.
        Used by ML models for predictions.
        """
        if not self.client:
            print("Gemini client not initialized - API key missing")
            return None
        try:
            # Retry logic with key rotation
            max_retries = len(self.api_keys) * 2
            
            for attempt in range(max_retries):
                try:
                     response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=prompt
                    )
                     return response.text
                except Exception as e:
                    print(f"Primary model {self.model_name} failed: {e}. Trying fallback {self.fallback_model}...")
                    try:
                        response = self.client.models.generate_content(
                            model=self.fallback_model,
                            contents=prompt
                        )
                        return response.text
                    except Exception as fallback_e:
                        # Check for quota/resource exhaustion on either attempt
                        error_str = str(e)
                        fallback_error_str = str(fallback_e)
                        
                        if ("429" in error_str or "RESOURCE_EXHAUSTED" in error_str or 
                            "429" in fallback_error_str or "RESOURCE_EXHAUSTED" in fallback_error_str):
                            print(f"Quota exceeded on key index {self.current_key_index}. Rotating key...")
                            if self._rotate_key():
                                continue
            return None
        except Exception as e:
            print(f"Gemini Generation Error: {e}")
            return None

    def analyze_image(self, prompt, image_data):
        """
        Analyze an image using Gemini's vision capabilities.
        """
        if not self.client:
            print("Gemini client not initialized - API key missing")
            return None
        try:
            # For image analysis, use the vision-capable model
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=[prompt, image_data]
                )
            except Exception as e:
                print(f"Primary model {self.model_name} failed: {e}. Trying fallback {self.fallback_model}...")
                response = self.client.models.generate_content(
                    model=self.fallback_model,
                    contents=[prompt, image_data]
                )
            return response.text
        except Exception as e:
            print(f"Gemini Image Analysis Error: {e}")
            return None

    def analyze_market_trends(self, crops=['Tomato', 'Onion', 'Wheat', 'Cotton', 'Soybean']):
        """
        Analyze market trends for specific crops using Gemini.
        Returns a list of trend objects in JSON format.
        """
        if not self.client:
            return None
        
        prompt = f"""
        Analyze the current market trends for these crops in India: {', '.join(crops)}.
        Consider factors like recent weather, harvest season, government policies, and global demand.
        
        Provide the output EXCLUSIVELY as a JSON array of objects. Each object must have:
        - "crop": string (name of crop)
        - "trend": string ("Rising", "Falling", or "Stable")
        - "reason": string (brief explanation, max 10 words)
        - "confidence": integer (0-100)

        Example format:
        [
            {{"crop": "Tomato", "trend": "Rising", "reason": "Heavy rains damaged crops", "confidence": 85}}
        ]
        """
        
        try:
            response_text = self.generate_response(prompt)
            if not response_text:
                return None
            
            # Clean up response to ensure valid JSON
            response_text = response_text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
            
            return json.loads(response_text)
        except Exception as e:
            print(f"Gemini Market Analysis Error: {e}")
            return None

gemini_service = GeminiService()
