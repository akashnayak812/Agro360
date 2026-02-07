from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key found")
    exit()

client = genai.Client(api_key=api_key)

try:
    print("Listing models...")
    # existing SDK might have different list_models signature or location
    # verify_api.py might have clues, or I can just try the standard way for this SDK
    # The new SDK structure: client.models.list()
    for model in client.models.list():
        print(f"Model: {model.name}, Display Name: {model.display_name}")
except Exception as e:
    print(f"Error listing models: {e}")
