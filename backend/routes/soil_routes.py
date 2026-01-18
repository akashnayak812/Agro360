from flask import Blueprint, request, jsonify
from models.ml_models import soil_model

soil_bp = Blueprint('soil_bp', __name__)

@soil_bp.route('/analyze', methods=['POST'])
def analyze_soil():
    try:
        data = request.json
        # Expecting: {"N": 90, "P": 42, "K": 43, "ph": 6.5, "moisture": 50}
        features = [
            float(data.get('N')),
            float(data.get('P')),
            float(data.get('K')),
            float(data.get('ph')),
            float(data.get('moisture', 50))
        ]
        
        status, advice = soil_model.predict(features)
        
        return jsonify({
            "success": True,
            "status": status,
            "advice": advice,
            "message": f"Soil health is {status}."
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
