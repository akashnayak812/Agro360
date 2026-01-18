import requests
import json
import time

BASE_URL = "http://127.0.0.1:5001/api/auth"

def test_auth():
    print("Testing Authentication Endpoints...")
    
    # Unique email for testing
    email = f"test_{int(time.time())}@example.com"
    password = "password123"
    name = "Test User"

    # 1. Register
    print(f"\n1. Testing Registration ({email})...")
    try:
        res = requests.post(f"{BASE_URL}/register", json={
            "email": email,
            "password": password,
            "name": name
        })
        if res.status_code == 201:
            print("✅ Registration Successful")
            print(res.json())
        else:
            print(f"❌ Registration Failed: {res.status_code} - {res.text}")
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    # 2. Login
    print("\n2. Testing Login...")
    token = None
    try:
        res = requests.post(f"{BASE_URL}/login", json={
            "email": email,
            "password": password
        })
        if res.status_code == 200:
            print("✅ Login Successful")
            token = res.json().get("access_token")
            print(f"Token received: {token[:20]}...")
        else:
            print(f"❌ Login Failed: {res.status_code} - {res.text}")
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    # 3. Access Protected Route
    print("\n3. Testing Protected Route (/me)...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        res = requests.get(f"{BASE_URL}/me", headers=headers)
        if res.status_code == 200:
            print("✅ Protected Route Access Successful")
            print(res.json())
        else:
            print(f"❌ Protected Route Access Failed: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_auth()
