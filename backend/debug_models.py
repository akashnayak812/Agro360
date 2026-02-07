import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load env vars
load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
print(f"Using API Key ending in: ...{api_key[-5:] if api_key else 'None'}")

if not api_key:
    print("No API Key found.")
    exit(1)

genai.configure(api_key=api_key)

print("Listing available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
