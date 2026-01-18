import google.generativeai as genai
import os
import json

# Configure Gemini
# In a real scenario, use os.environ.get("GEMINI_API_KEY")
# For this task, using the user provided key directly as requested, though env var is safer.
API_KEY = "AIzaSyA7GyZeUz3IwMTXP5OFNsZo7_tv81OpnhM"
genai.configure(api_key=API_KEY)

class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-flash-latest')
        self.chat = self.model.start_chat(history=[])
        
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
        try:
            # Construct the prompt with context
            full_prompt = f"""
            {self.system_prompt}
            
            Current User Language Preference: {language}
            User Query: {text}
            
            Respond in valid JSON format only.
            """
            
            response = self.model.generate_content(full_prompt)
            
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
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini Generation Error: {e}")
            return None

gemini_service = GeminiService()
