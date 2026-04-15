from google import genai
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

LANGUAGE_MAP = {
    'en': 'English',
    'hi': 'Hindi',
    'te': 'Telugu',
    'ta': 'Tamil',
    'kn': 'Kannada',
    'mr': 'Marathi',
    'bn': 'Bengali',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'ml': 'Malayalam',
    'ur': 'Urdu',
    'de': 'German',
    'es': 'Spanish',
    'fr': 'French',
    'zh': 'Chinese'
}

# Configure Gemini from environment variable
class GeminiService:
    def __init__(self):
        # Load all available keys
        self.api_keys = [
            os.environ.get("GEMINI_API_KEY"),
            os.environ.get("GEMINI_API_KEY_2"),
            os.environ.get("GEMINI_API_KEY_3"),
            os.environ.get("GEMINI_API_KEY_4"),
            os.environ.get("GEMINI_API_KEY_5"),
            os.environ.get("GEMINI_API_KEY_6")
        ]
        # Filter out None values
        self.api_keys = [key for key in self.api_keys if key]
        
        self.current_key_index = 0
        self.client = None
        self.model_name = "gemini-2.5-flash"
        self.fallback_models = ["gemini-3-flash-preview", "gemini-2.5-flash-lite", "gemini-flash-latest"]

        self._initialize_client()

        # System instruction with agriculture domain + navigation support
        self.system_prompt = """
        You are an intelligent agricultural assistant for the 'Agro360' smart farming platform.
        Your role is to assist farmers with questions related to:
        - Crop management and selection
        - Fertilizer application and nutrients
        - Soil health and analysis
        - Plant disease detection and treatment
        - Weather advisory and sowing timing
        - General farming best practices
        - Navigating the Agro360 application

        NAVIGATION COMMANDS:
        When the user wants to navigate to a page, detect the intent and return the appropriate intent string:
        - dashboard/home → "navigate_dashboard"
        - crop/crops → "navigate_crop"
        - fertilizer → "navigate_fertilizer"
        - yield/harvest → "navigate_yield"
        - soil → "navigate_soil"
        - disease/plant doctor → "navigate_disease"
        - advisory/weather → "navigate_advisory"
        - community/forum → "navigate_community"
        - simulator/digital twin → "navigate_simulator"
        - market/prices → "navigate_market"
        - risk → "navigate_risk"
        - 3d/farm3d → "navigate_farm3d"
        - scheme/government → "navigate_schemes"
        - developer → "navigate_developer"
        - login/sign in → "navigate_login"
        - register/sign up → "navigate_register"

        Navigation commands can be in ANY language (e.g., "डैशबोर्ड खोलो" → navigate_dashboard).

        CRITICAL CONSTRAINTS:
        1. IF a user asks about anything unrelated to agriculture, farming, weather, or the app's features, POLITELY REFUSE.
        2. Keep answers concise, practical, and easy to understand for a farmer.
        3. LANGUAGE RULE: You MUST respond ENTIRELY in the user's language. Never mix languages.
        4. Provide the response as a JSON object:
           {
             "response": "The response IN THE USER'S LANGUAGE",
             "intent": "general_query" or "navigate_dashboard" etc.,
             "language_detected": "en" or "hi" or "te" etc.
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
            # Retry logic with key rotation
            max_retries = len(self.api_keys)
            
            # List of models to try in order
            models_to_try = [self.model_name] + self.fallback_models

            for key_attempt in range(max_retries):
                for model in models_to_try:
                    try:
                        # Try with current configuration
                        response = self.client.models.generate_content(
                            model=model,
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
                        print(f"Model {model} failed with key index {self.current_key_index}: {e}")
                        
                        # Check for quota/resource exhaustion
                        error_str = str(e)
                        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                            # If it's a quota error, we might want to switch keys, but let's try other models first 
                            # on the same key unless all models fail.
                            # However, usually quota is per project/key, not per model (though sometimes per model).
                            # Let's continue to the next model first.
                            continue
                        else:
                            # If it's another error (like model not found), continue to next model
                            continue
                
                # If we've tried all models on this key and failed, rotate key
                print(f"All models failed on key index {self.current_key_index}. Rotating key...")
                if not self._rotate_key():
                    break # No more keys to rotate
            
            # If we exit the loops without returning, it means total failure
            raise Exception("All models and keys exhausted.")

        except Exception as e:
            print(f"Gemini API Error: {e}")
            return {
                "response": "I'm having trouble connecting to the farm network right now. Please try again.", 
                "intent": "error",
                "success": False
            }

    def generate_response(self, prompt, language='en'):
        """
        Generic method to generate content from Gemini based on a prompt.
        Used by ML models for predictions.
        """
        if not self.client:
            print("Gemini client not initialized - API key missing")
            return None
        
        target_lang = LANGUAGE_MAP.get(language, 'English')
        lang_instruction = f"\n\nRespond entirely in {target_lang}. If the language is '{language}', respond in {target_lang}. Default to English if unsure."
        full_prompt = prompt + lang_instruction

        try:
            # Retry logic with key rotation
            max_retries = len(self.api_keys)
            models_to_try = [self.model_name] + self.fallback_models
            
            for key_attempt in range(max_retries):
                for model in models_to_try:
                    try:
                         response = self.client.models.generate_content(
                            model=model,
                            contents=full_prompt
                        )
                         return response.text
                    except Exception as e:
                        print(f"Model {model} failed: {e}")
                        # Continue to next model
                        continue
                
                # If all models fail on this key, rotate
                print(f"Quota exceeded or all models failed on key index {self.current_key_index}. Rotating key...")
                if not self._rotate_key():
                    return None
            return None
        except Exception as e:
            print(f"Gemini Generation Error: {e}")
            return None

    def analyze_image(self, prompt, image_data, language='en'):
        """
        Analyze an image using Gemini's vision capabilities.
        """
        if not self.client:
            print("Gemini client not initialized - API key missing")
            return None
        
        target_lang = LANGUAGE_MAP.get(language, 'English')
        lang_instruction = f"\n\nRespond entirely in {target_lang}. If the language is '{language}', respond in {target_lang}."
        full_prompt = prompt + lang_instruction

        try:
            # For image analysis, use the vision-capable model
            models_to_try = [self.model_name] + self.fallback_models
            
            for model in models_to_try:
                try:
                    response = self.client.models.generate_content(
                        model=model,
                        contents=[full_prompt, image_data]
                    )
                    return response.text
                except Exception as e:
                    print(f"Model {model} failed: {e}. Trying next...")
                    continue
            
            # If all models fail (image analysis often doesn't rotate keys as strictly in this snippet, can add if needed)
            print("All image analysis models failed.")
            return None
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

    def translate_text(self, text, language):
        """
        Translates short ML predictions (e.g. crop names, disease names) to the target language.
        """
        if language == 'en' or not text:
            return text
        
        target_lang = LANGUAGE_MAP.get(language, 'English')
        prompt = f"Translate the word or short phrase '{text}' to {target_lang}. Return ONLY the translated word/phrase, with no extra punctuation, whitespace, or explanation."
        
        translated = self.generate_response(prompt, language='en')
        if translated:
            return translated.strip()
        return text

gemini_service = GeminiService()
