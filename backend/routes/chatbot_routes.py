from flask import Blueprint, request, jsonify
from services.gemini_service import gemini_service
import json

chatbot_bp = Blueprint('chatbot_bp', __name__)

# Navigation map: intent → route info
NAVIGATION_MAP = {
    'navigate_dashboard': {'route': '/dashboard', 'label': 'Dashboard'},
    'navigate_crop': {'route': '/crop', 'label': 'Crop Recommendation'},
    'navigate_fertilizer': {'route': '/fertilizer', 'label': 'Fertilizer'},
    'navigate_yield': {'route': '/yield', 'label': 'Yield Prediction'},
    'navigate_soil': {'route': '/soil', 'label': 'Soil Health'},
    'navigate_disease': {'route': '/disease', 'label': 'Disease Detection'},
    'navigate_advisory': {'route': '/advisory', 'label': 'Advisory'},
    'navigate_community': {'route': '/community', 'label': 'Community'},
    'navigate_simulator': {'route': '/simulator', 'label': 'Farm Simulator'},
    'navigate_market': {'route': '/market', 'label': 'Market Insights'},
    'navigate_risk': {'route': '/risk', 'label': 'Risk Assessment'},
    'navigate_farm3d': {'route': '/farm3d', 'label': '3D Farm View'},
    'navigate_schemes': {'route': '/schemes', 'label': 'Govt Schemes'},
    'navigate_developer': {'route': '/developer', 'label': 'Developer'},
    'navigate_login': {'route': '/login', 'label': 'Login'},
    'navigate_register': {'route': '/register', 'label': 'Register'},
}


@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    language = data.get('language', 'en')
    
    if not message:
        return jsonify({"success": False, "error": "No message provided"})

    try:
        result = gemini_service.process_farming_intent(message, language)
        
        intent = result.get('intent', 'general_query')
        response_data = {
            "success": True,
            "response": result.get('response'),
            "intent": intent,
            "language_detected": result.get('language_detected', language)
        }

        # If navigation intent detected, include navigation info
        nav_info = NAVIGATION_MAP.get(intent)
        if nav_info:
            response_data["navigation"] = {
                "route": nav_info['route'],
                "label": nav_info['label']
            }

        return jsonify(response_data)
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
