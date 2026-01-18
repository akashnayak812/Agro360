from flask import Blueprint, request, jsonify
from services.gemini_service import gemini_service

voice_bp = Blueprint('voice_bp', __name__)

@voice_bp.route('/process', methods=['POST'])
def process_voice():
    data = request.json
    text = data.get('text')
    language = data.get('language', 'en')
    
    if not text:
        return jsonify({"success": False, "message": "No text provided"})

    result = gemini_service.process_farming_intent(text, language)
    
    if result:
        return jsonify({
            "success": True, 
            "intent": result.get('intent'),
            "response": result.get('response'),
            "target": result.get('target', None),
            "entities": result.get('entities', {})
        })
    else:
        return jsonify({"success": False, "response": "I'm having trouble understanding. Please try again."})
