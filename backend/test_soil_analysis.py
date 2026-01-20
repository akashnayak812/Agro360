import requests
import io
from PIL import Image

BASE_URL = "http://localhost:5001/api/soil"

def create_dummy_image(color):
    """Create a 100x100 dummy image with specific color."""
    img = Image.new('RGB', (100, 100), color=color)
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    return img_byte_arr.getvalue()

def test_soil_analysis():
    print("\n--- Testing Soil Image Analysis ---")
    
    # Test Red Soil (Reddish color)
    print("\nTesting Red Soil Simulation...")
    red_img = create_dummy_image(color=(180, 50, 50)) # Distinct Red
    files = {"image": ("red_soil.jpg", red_img, "image/jpeg")}
    
    try:
        res = requests.post(f"{BASE_URL}/analyze-image", files=files)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.json()}")
    except Exception as e:
        print(f"Failed: {e}")

    # Test Black Soil (Dark Gray/Black)
    print("\nTesting Black Soil Simulation...")
    black_img = create_dummy_image(color=(40, 40, 40)) # Dark Gray
    files = {"image": ("black_soil.jpg", black_img, "image/jpeg")}
    
    try:
        res = requests.post(f"{BASE_URL}/analyze-image", files=files)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.json()}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_soil_analysis()
