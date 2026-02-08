import requests
import json

def test_backend_advisory():
    url = "http://localhost:5001/api/advisory/current"
    print(f"Testing backend endpoint: {url}")
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        try:
            data = response.json()
            print("Response JSON:")
            print(json.dumps(data, indent=2))
        except:
            print(f"Raw Response: {response.text}")
    except Exception as e:
        print(f"Failed to connect: {e}")
        print("\nPossible causes:")
        print("1. The backend server is NOT running.")
        print("2. It is running on a different port (not 5001).")

if __name__ == "__main__":
    test_backend_advisory()
