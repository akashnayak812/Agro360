from flask import Blueprint, request, jsonify
from models.ml_models import fertilizer_model
import numpy as np

fertilizer_bp = Blueprint('fertilizer_bp', __name__)

@fertilizer_bp.route('/recommend', methods=['POST'])
def recommend_fertilizer():
    try:
        data = request.json
        language = data.get('language', 'en')
        # Expecting: {"N": 50, "P": 50, "K": 50, "ph": 6.5, "crop": "Rice"}
        # Logic is inside the model, or simple rule here since model is mock
        
        prediction = fertilizer_model.predict([
            data.get('N'), data.get('P'), data.get('K'), data.get('ph')
        ])
        
        message = f"For {data.get('crop', 'this crop')}, usage of {prediction} is recommended."
        
        if language and language != 'en':
            from services.gemini_service import gemini_service
            trans_pred = gemini_service.translate_text(prediction, language)
            prompt = f"Translate the following recommendation message. Replace the fertilizer and crop names with their translations. Return ONLY the translated string:\n\n{message}"
            trans_msg = gemini_service.generate_response(prompt, language)
            
            prediction = trans_pred if trans_pred else prediction
            message = trans_msg.strip() if trans_msg else message

        return jsonify({
            "success": True,
            "fertilizer": prediction,
            "message": message
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
