from flask import Blueprint, request, jsonify
from models.ml_models import soil_model

soil_bp = Blueprint('soil_bp', __name__)

@soil_bp.route('/analyze', methods=['POST'])
def analyze_soil():
    try:
        data = request.json
        language = data.get('language', 'en')
        # Expecting: {"N": 90, "P": 42, "K": 43, "ph": 6.5, "moisture": 50}
        features = [
            float(data.get('N')),
            float(data.get('P')),
            float(data.get('K')),
            float(data.get('ph')),
            float(data.get('moisture', 50))
        ]
        
        result = soil_model.predict(features, language)
        
        # Handle both old (3-tuple) and new (5-tuple) return format
        if len(result) == 5:
            status, advice, recommended_crops, health_score, details = result
        else:
            status, advice, recommended_crops = result[:3]
            health_score = 50
            details = {}
        
        return jsonify({
            "success": True,
            "status": status,
            "advice": advice,
            "recommended_crops": recommended_crops,
            "health_score": health_score,
            "component_scores": details.get("component_scores", {}),
            "deficiencies": details.get("deficiencies", []),
            "message": f"Soil health is {status}. Score: {health_score}/100"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
