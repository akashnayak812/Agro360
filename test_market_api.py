import json
import sys
import os

# Adds backend to python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app import app, db

def test_endpoints():
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        with app.app_context():
            print("Checking database...")
            # We must make sure DB is created
            db.create_all()
            
            print("\nTesting /api/market/states endpoint...")
            r = client.get("/api/market/states")
            print("Status Code:", r.status_code)
            data = r.get_json()
            print("Response:", data)
            
            if not data or not data.get('states'):
                print("No states found!")
                return
                
            test_state = data['states'][0]
            
            print(f"\nTesting /api/market/markets-by-state?state={test_state}...")
            r2 = client.get(f"/api/market/markets-by-state?state={test_state}")
            print("Status:", r2.status_code)
            data2 = r2.get_json()
            print("Response:", data2)
            
            if not data2 or not data2.get('markets'):
                print("No markets found!")
                return
                
            test_market = data2['markets'][0]
            
            print(f"\nTesting /api/market/crops?market={test_market}...")
            r3 = client.get(f"/api/market/crops?market={test_market}")
            print("Status:", r3.status_code)
            data3 = r3.get_json()
            print("Response:", data3)
            
            if not data3 or not data3.get('crops'):
                print("No crops found!")
                return
                
            test_crop = data3['crops'][0]
            
            print(f"\nTesting /api/market/market-insights?state={test_state}&market={test_market}&crop={test_crop}...")
            r4 = client.get(f"/api/market/market-insights?state={test_state}&market={test_market}&crop={test_crop}")
            print("Status:", r4.status_code)
            print("Response:", json.dumps(r4.get_json(), indent=2))
            
if __name__ == "__main__":
    print("Starting tests...")
    test_endpoints()
