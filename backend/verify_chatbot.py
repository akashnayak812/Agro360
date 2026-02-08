import requests
import json

BASE_URL = "http://localhost:5001/api"

def test_chatbot():
    print("\n--- Testing Chatbot ---")
    data = {
        "message": "What is the best fertilizer for rice?",
        "language": "en"
    }
    try:
        res = requests.post(f"{BASE_URL}/chatbot/chat", json=data)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_chatbot()
