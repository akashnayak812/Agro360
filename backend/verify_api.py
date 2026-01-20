import requests
import json
import io

BASE_URL = "http://localhost:5001/api"

def test_crop_recommendation():
    print("\n--- Testing Crop Recommendation ---")
    data = {
        "N": 90, "P": 42, "K": 43, "temperature": 20.8, "humidity": 82, "ph": 6.5, "rainfall": 202.9
    }
    try:
        res = requests.post(f"{BASE_URL}/crop/recommend", json=data)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text[:200]}...")
    except Exception as e:
        print(f"Failed: {e}")

def test_fertilizer_recommendation():
    print("\n--- Testing Fertilizer Recommendation ---")
    data = {
        "N": 50, "P": 50, "K": 50, "ph": 6.5, "crop": "Rice"
    }
    try:
        res = requests.post(f"{BASE_URL}/fertilizer/recommend", json=data)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text[:200]}...")
    except Exception as e:
        print(f"Failed: {e}")

def test_yield_prediction():
    print("\n--- Testing Yield Prediction ---")
    data = {"crop": "Rice", "area": 10, "rainfall": 150, "fertilizer": 500}
    try:
        res = requests.post(f"{BASE_URL}/yield/predict", json=data)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text[:200]}...")
    except Exception as e:
        print(f"Failed: {e}")

def test_disease_detection():
    print("\n--- Testing Disease Detection ---")
    # specific fake image bytes
    fake_image = io.BytesIO(b"\x00\x00\x00\x00") 
    files = {"image": ("test.jpg", fake_image, "image/jpeg")}
    try:
        res = requests.post(f"{BASE_URL}/disease/detect", files=files)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text[:200]}...")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_crop_recommendation()
    test_fertilizer_recommendation()
    test_yield_prediction()
    test_disease_detection()
