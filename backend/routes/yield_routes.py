from flask import Blueprint, request, jsonify
from models.ml_models import yield_model
import numpy as np

yield_bp = Blueprint('yield_bp', __name__)

@yield_bp.route('/predict', methods=['POST'])
def predict_yield():
    try:
        data = request.json
        language = data.get('language', 'en')
        # Expecting: {"crop": "Rice", "area": 10, "rainfall": 150, "fertilizer": 500}
        
        # Mock encoding for crop if needed, but here we just pass simplified numeric args
        # [crop_idx, area, rainfall, fertilizer]
        features = [
            0, # Mock crop index since we don't have encoder loaded
            float(data.get('area', 1)),
            float(data.get('rainfall', 100)),
            float(data.get('fertilizer', 0))
        ]
        
        prediction = yield_model.predict(features)
        
        message = f"Estimated yield for {data.get('area')} hectares is {prediction} tons."
        if language and language != 'en':
            from services.gemini_service import gemini_service
            prompt = f"Translate the following message. Return ONLY the translated string:\n\n{message}"
            trans_msg = gemini_service.generate_response(prompt, language)
            message = trans_msg.strip() if trans_msg else message

        return jsonify({
            "success": True,
            "predicted_yield": prediction,
            "unit": "tons",
            "message": message
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
