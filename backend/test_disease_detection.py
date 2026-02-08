import sys
import os
from dotenv import load_dotenv
import cv2
import numpy as np
from PIL import Image
import io

# Add current directory to path so we can import modules
sys.path.append(os.getcwd())

load_dotenv()

from services.gemini_service import gemini_service

def create_dummy_image():
    # Create a green image (simulating a leaf)
    img = np.zeros((300, 300, 3), dtype=np.uint8)
    img[:] = (0, 128, 0) # Green color
    
    # Add some "disease" spots (brown)
    cv2.circle(img, (150, 150), 20, (30, 105, 210), -1)
    
    # Encode to bytes
    success, encoded_img = cv2.imencode('.jpg', img)
    return encoded_img.tobytes()

def test_disease_detection():
    print("Testing Disease Detection Gemini Call...")
    
    try:
        image_bytes = create_dummy_image()
        # Create a PIL image to pass to Gemini (it expects PIL Image or bytes, usually specific client handles it)
        # Based on gemini_service.py: contents=[prompt, image_data]
        # We need to see what `image_data` should be. 
        # The google-genai library usually accepts PIL images directly.
        
        pil_image = Image.open(io.BytesIO(image_bytes))
        
        prompt = """
        Analyze this plant leaf image. Identify the disease (if any).
        Return purely JSON in this format:
        {
            "disease": "Name of disease", 
            "symptoms": "Description of symptoms observed", 
            "treatment_steps": ["Step 1", "Step 2", "Step 3"]
        }
        """
        
        print("Sending image to Gemini...")
        response_text = gemini_service.analyze_image(prompt, pil_image)
        print(f"Raw Response from Gemini: {response_text}")
        
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_disease_detection()
