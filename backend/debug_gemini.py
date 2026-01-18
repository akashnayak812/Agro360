from services.gemini_service import gemini_service
import json

def test_crop_prediction():
    print("Testing Crop Prediction Gemini Call...")
    data = [90, 42, 43, 20.8, 82, 6.5, 202.9]
    prompt = f"""
    Act as an agronomy expert. Suggest the best crop to grow based on these soil and weather conditions:
    Nitrogen: {data[0]}, Phosphorus: {data[1]}, Potassium: {data[2]}
    Temperature: {data[3]}°C, Humidity: {data[4]}%, pH: {data[5]}, Rainfall: {data[6]}mm
    
    Return ONLY a JSON object with this format (no markdown):
    {{ "crop": "Crop Name", "confidence": 0.95, "reason": "Detailed explanation" }}
    """
    
    try:
        print("Sending prompt to Gemini...")
        response_text = gemini_service.generate_response(prompt)
        print(f"Raw Response from Gemini: {response_text}")
        
        if response_text:
            clean_response = response_text.replace('```json', '').replace('```', '').strip()
            print(f"Cleaned Response: {clean_response}")
            res_json = json.loads(clean_response)
            print(f"Parsed JSON: {res_json}")
        else:
            print("Response text was None or empty.")
            
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_crop_prediction()
