from services.gemini_service import gemini_service
import random
import json

class CropRecommender:
    def predict(self, data):
        # data: [N, P, K, temp, hum, ph, rain]
        prompt = f"""
        Act as an agronomy expert. Suggest the best crop to grow based on these soil and weather conditions:
        Nitrogen: {data[0][0]}, Phosphorus: {data[0][1]}, Potassium: {data[0][2]}
        Temperature: {data[0][3]}°C, Humidity: {data[0][4]}%, pH: {data[0][5]}, Rainfall: {data[0][6]}mm
        
        Return ONLY a JSON object with this format (no markdown):
        {{ "crop": "Crop Name", "confidence": 0.95, "reason": "Detailed explanation" }}
        """
        response = gemini_service.generate_response(prompt)
        if response:
            try:
                # Clean potential markdown
                clean_response = response.replace('```json', '').replace('```', '')
                res_json = json.loads(clean_response)
                return res_json['crop'], res_json['confidence']
            except:
                pass
        
        # Fallback to mock if API fails
        print("Gemini failed, using fallback.")
        return "Rice (Fallback)", 0.85

class FertilizerRecommender:
    def predict(self, data):
        # data: [N, P, K, pH]
        prompt = f"""
        Suggest a fertilizer for soil with: Nitrogen: {data[0]}, Phosphorus: {data[1]}, Potassium: {data[2]}, pH: {data[3]}.
        Return ONLY the fertilizer name.
        """
        response = gemini_service.generate_response(prompt)
        if response:
             return response.strip()
        return "Urea (Fallback)"

class YieldPredictor:
    def predict(self, data):
        prompt = f"""
        Estimate crop yield (tons/hectare) for:
        Area: {data[1]} hectares, Rainfall: {data[2]}mm, Fertilizer: {data[3]}kg.
        Return ONLY the number (float).
        """
        response = gemini_service.generate_response(prompt)
        if response:
            try:
                # Extract number from string
                return float(''.join(c for c in response if c.isdigit() or c == '.'))
            except:
                pass
        return 4.5

class SoilHealthAnalyzer:
    def predict(self, data):
        # data: [N, P, K, pH, moisture]
        prompt = f"""
        Analyze soil health: N:{data[0]}, P:{data[1]}, K:{data[2]}, pH:{data[3]}, Moisture:{data[4]}%.
        Classify as Good/Moderate/Poor and give 1 sentence advice.
        Return JSON: {{ "status": "Good", "advice": "advice string" }}
        """
        response = gemini_service.generate_response(prompt)
        if response:
            try:
                clean_response = response.replace('```json', '').replace('```', '')
                res_json = json.loads(clean_response)
                return res_json['status'], res_json['advice']
            except:
                pass
        return "Moderate (Fallback)", "Balanced fertilization needed."

class DiseaseDetector:
    def predict(self, image_data):
        prompt = """
        Analyze this plant leaf image. Identify the disease (if any).
        Return purely JSON in this format:
        {
            "disease": "Name of disease", 
            "symptoms": "Description of symptoms observed", 
            "treatment": "Recommended treatment"
        }
        If the image is not a plant or not clear, return:
        { "disease": "Unknown", "symptoms": "Image not clear or not a plant", "treatment": "Please upload a clear image of a plant leaf." }
        """
        
        if image_data:
            print("Sending image to Gemini for analysis...")
            response = gemini_service.analyze_image(prompt, image_data)
            if response:
                try:
                    # Clean potential markdown
                    clean_response = response.replace('```json', '').replace('```', '').strip()
                    res_json = json.loads(clean_response)
                    return res_json.get('disease', 'Unknown'), res_json.get('symptoms', ''), res_json.get('treatment', '')
                except Exception as e:
                    print(f"Error parsing Gemini response: {e}")
                    pass
        
        # Fallback to mock if API fails or no image
        print("Using mock disease detection.")
        scenarios = ["Yellow spots on tomato leaves", "White powder on rose leaves", "Brown rot on potato"]
        scenario = random.choice(scenarios)
        
        prompt_text = f"""
        Act as a plant pathologist. A farmer describes: "{scenario}".
        Diagnose it. Return JSON: {{ "disease": "Name", "symptoms": "Description", "treatment": "Treatment" }}
        """
        response = gemini_service.generate_response(prompt_text)
         
        if response:
             try:
                clean_response = response.replace('```json', '').replace('```', '')
                res_json = json.loads(clean_response)
                return res_json['disease'], res_json['symptoms'], res_json['treatment']
             except:
                pass
        
        return "Unknown", "Consult an expert", "None"

# Singleton instances
crop_model = CropRecommender()
fertilizer_model = FertilizerRecommender()
yield_model = YieldPredictor()
soil_model = SoilHealthAnalyzer()
disease_model = DiseaseDetector()
