from flask import Blueprint, request, jsonify
from models.ml_models import crop_model
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
