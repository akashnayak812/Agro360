from google import genai
import os

key = "AIzaSyDn84FHKdEeG_dIFPE79N7GxIPeVRQhc4g"

def test_key():
    print(f"Testing key: {key[:10]}...")
    try:
        client = genai.Client(api_key=key)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents="Hello, are you working?"
        )
        print(f"Success! Response: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_key()
