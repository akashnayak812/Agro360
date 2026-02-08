from google import genai
import os

key = "AIzaSyDd6IUMbwYNgame_tWydkeV25EHp6qmu3I"

def test_key():
    models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite-001", "gemini-flash-latest"]
    
    for model in models:
        print(f"Testing model: {model}...")
        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model=model,
                contents="Hello, are you working?"
            )
            print(f"Success with {model}! Response: {response.text}")
            return
        except Exception as e:
            print(f"Failed {model}: {e}")

if __name__ == "__main__":
    test_key()
