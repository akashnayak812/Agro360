from flask import Blueprint, request, jsonify
from models.ml_models import crop_model
from services.location_service import convert_simple_to_technical, get_soil_data_by_type, SOIL_TYPE_DATA
import numpy as np

crop_bp = Blueprint('crop_bp', __name__)

@crop_bp.route('/recommend', methods=['POST'])
def recommend_crop():
    try:
        data = request.json
        # Expecting: {"N": 90, "P": 42, "K": 43, "temperature": 20.8, "humidity": 82, "ph": 6.5, "rainfall": 202.9}
        features = [
            float(data.get('N')),
            float(data.get('P')),
            float(data.get('K')),
            float(data.get('temperature', 25)), # Default fallback
            float(data.get('humidity', 70)),
            float(data.get('ph', 6.5)),
            float(data.get('rainfall', 100))
        ]
        
        prediction, confidence = crop_model.predict(np.array([features]))
        
        return jsonify({
            "success": True,
            "crop": prediction,
            "confidence": confidence,
            "message": f"Based on the soil and weather conditions, {prediction} is the best suitable crop."
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@crop_bp.route('/recommend-simple', methods=['POST'])
def recommend_crop_simple():
    """
    Simple mode for uneducated farmers.
    Accepts: {
        state: "Telangana",
        district: "Hyderabad",
        soil_type: "black_sticky" (optional - visual selection),
        water: "normal" | "good" | "heavy" | "less" | "very_less" (optional)
    }
    """
    try:
        data = request.json
        
        # Convert simple inputs to technical values
        technical = convert_simple_to_technical(data)
        
        # Override with soil type if provided
        if 'soil_type' in data:
            soil_data = get_soil_data_by_type(data['soil_type'])
            if soil_data.get('success'):
                technical['N'] = soil_data['N']
                technical['P'] = soil_data['P']
                technical['K'] = soil_data['K']
                technical['ph'] = soil_data['ph']
        
        # Prepare features for model
        features = [
            float(technical.get('N', 40)),
            float(technical.get('P', 35)),
            float(technical.get('K', 40)),
            float(technical.get('temperature', 25)),
            float(technical.get('humidity', 70)),
            float(technical.get('ph', 6.5)),
            float(technical.get('rainfall', 100))
        ]
        
        prediction, confidence = crop_model.predict(np.array([features]))
        
        # Get soil type info for response
        soil_info = SOIL_TYPE_DATA.get(data.get('soil_type', ''), {})
        
        return jsonify({
            "success": True,
            "crop": prediction,
            "confidence": confidence,
            "message": f"Based on your location and soil, {prediction} is the best crop for you!",
            "location": {
                "state": data.get('state'),
                "district": data.get('district')
            },
            "detected_values": {
                "N": technical.get('N'),
                "P": technical.get('P'),
                "K": technical.get('K'),
                "ph": technical.get('ph'),
                "temperature": technical.get('temperature'),
                "humidity": technical.get('humidity'),
                "rainfall": technical.get('rainfall')
            },
            "soil_info": {
                "type": data.get('soil_type'),
                "name": soil_info.get('name', 'Unknown'),
                "recommended_crops": soil_info.get('crops', [])
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
