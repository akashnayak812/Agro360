from flask import Blueprint, request, jsonify
from services.gemini_service import gemini_service
import json

chatbot_bp = Blueprint('chatbot_bp', __name__)

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    language = data.get('language', 'en')
    
    if not message:
        return jsonify({"success": False, "error": "No message provided"})

    try:
        result = gemini_service.process_farming_intent(message, language)
        
        return jsonify({
            "success": True,
            "response": result.get('response'),
            "intent": result.get('intent'),
            "language_detected": result.get('language_detected', language)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "response": "Sorry, I'm having trouble processing your request. Please try again."
        })

@chatbot_bp.route('/clear', methods=['POST'])
def clear_chat():
    # Reset the chat history
    gemini_service.chat = gemini_service.model.start_chat(history=[])
    return jsonify({"success": True, "message": "Chat history cleared"})
