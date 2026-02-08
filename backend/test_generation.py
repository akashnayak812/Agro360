from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

def test_model(model_name):
    print(f"Testing model: {model_name}...")
    try:
        response = client.models.generate_content(
            model=model_name,
            contents="Hello, suggest a crop for sandy soil."
        )
        print(f"Success with {model_name}! Response: {response.text[:50]}...")
    except Exception as e:
        print(f"Failed with {model_name}: {e}")

if __name__ == "__main__":
    # Test a known stable model first
    test_model("gemini-1.5-flash")
    test_model("gemini-2.0-flash")
    test_model("gemini-2.5-flash") # This is likely the one causing issues
