from google import genai
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Gemini from environment variable
import PIL.Image
import io

# Configure Gemini from environment variable
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable is not set. Using fallback responses.")

class GeminiService:
    def __init__(self):
        self.client = None
        self.model_name = None
        
        if API_KEY:
            try:
                self.client = genai.Client(api_key=API_KEY)
                # Use gemini-flash-latest as default model
                self.model_name = "gemini-flash-latest"
                print(f"Successfully initialized Gemini client with model: {self.model_name}")
            except Exception as e:
                print(f"Failed to initialize Gemini client: {e}")
                self.client = None
        
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
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return response.text
        except Exception as e:
            # import traceback
            # traceback.print_exc()
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
            # Check if image_data is bytes, convert to PIL Image if so
            image_content = image_data
            if isinstance(image_data, bytes):
                try:
                    image_content = PIL.Image.open(io.BytesIO(image_data))
                except Exception as img_err:
                    print(f"Error converting bytes to image: {img_err}")
                    return None

            # For image analysis, use the vision-capable model
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=[prompt, image_content]
            )
            return response.text
        except Exception as e:
            print(f"Gemini Image Analysis Error: {e}")
            return None

gemini_service = GeminiService()
