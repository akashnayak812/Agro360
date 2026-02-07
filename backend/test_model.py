import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model_name = "gemini-flash-latest"
print(f"Testing model: {model_name}")

try:
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Hello, satisfy my quota check.")
    print("Success!")
    print(response.text)
except Exception as e:
    print(f"Failed: {e}")
