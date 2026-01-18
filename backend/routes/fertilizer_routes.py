from flask import Blueprint, request, jsonify
from models.ml_models import fertilizer_model
import numpy as np

fertilizer_bp = Blueprint('fertilizer_bp', __name__)

@fertilizer_bp.route('/recommend', methods=['POST'])
def recommend_fertilizer():
    try:
        data = request.json
        # Expecting: {"N": 50, "P": 50, "K": 50, "ph": 6.5, "crop": "Rice"}
        # Logic is inside the model, or simple rule here since model is mock
        
        prediction = fertilizer_model.predict([
            data.get('N'), data.get('P'), data.get('K'), data.get('ph')
        ])
        
        return jsonify({
            "success": True,
            "fertilizer": prediction,
            "message": f"For {data.get('crop', 'this crop')}, usage of {prediction} is recommended."
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
