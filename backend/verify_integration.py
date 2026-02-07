import requests
import json

BASE_URL = "http://127.0.0.1:5001/api"

def test_market_prices():
    print("\n--- Testing Market Prices with AI ---")
    url = f"{BASE_URL}/market/prices"
    payload = {"crop": "wheat", "market": "delhi"}
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        print(f"Status: {response.status_code}")
        if 'priceData' in data and 'aiAnalysis' in data['priceData']:
            print("AI Analysis Present: YES")
            print(json.dumps(data['priceData']['aiAnalysis'], indent=2))
        else:
            print("AI Analysis Present: NO")
            print(data.keys())
    except Exception as e:
        print(f"Error: {e}")

def test_risk_assessment():
    print("\n--- Testing Risk Assessment with AI ---")
    url = f"{BASE_URL}/risk/assess"
    payload = {
        "crop": "rice", 
        "location": "Hyderabad",
        "weather": {"temperature": 32, "humidity": 85, "rainfall": 10}
    }
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        print(f"Status: {response.status_code}")
        if 'aiAnalysis' in data:
            print("AI Analysis Present: YES")
            print(json.dumps(data['aiAnalysis'], indent=2))
        else:
            print("AI Analysis Present: NO")
            print(data.keys())
    except Exception as e:
        print(f"Error: {e}")

def test_simulator():
    print("\n--- Testing Simulator with AI ---")
    url = f"{BASE_URL}/simulator/run"
    payload = {
        "farmConfig": {"cropType": "wheat", "fieldArea": 5},
        "weatherConditions": {"temperature": 28, "humidity": 65}
    }
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        print(f"Status: {response.status_code}")
        if 'results' in data and 'aiAnalysis' in data['results']:
            print("AI Analysis Present: YES")
            print(json.dumps(data['results']['aiAnalysis'], indent=2))
        else:
            print("AI Analysis Present: NO (or incomplete structure)")
            print(data.get('results', {}).keys())
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_market_prices()
    test_risk_assessment()
    test_simulator()
