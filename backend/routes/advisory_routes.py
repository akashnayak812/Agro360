from flask import Blueprint, jsonify
from services.gemini_service import gemini_service
from datetime import datetime
import json

advisory_bp = Blueprint('advisory_bp', __name__)

@advisory_bp.route('/current', methods=['GET'])
def get_advisory():
    # In real app, fetch real weather. Here we simulate random valid weather.
    import random
    weather_conditions = ["Sunny", "Rainy", "Cloudy", "Windy"]
    condition = random.choice(weather_conditions)
    temp = random.randint(20, 35)
    humidity = random.randint(40, 90)

    prompt = f"""
    Generate agricultural advice for today.
    Weather: {condition}, {temp}°C, {humidity}% humidity.
    Date: {datetime.now().strftime("%Y-%m-%d")}
    
    Return JSON: 
    {{ 
        "farming_advice": ["tip1", "tip2"], 
        "sowing_recommendation": "One sentence about what to sow now." 
    }}
    """
    
    response = gemini_service.generate_response(prompt)
    if response:
        try:
            clean_response = response.replace('```json', '').replace('```', '')
            data = json.loads(clean_response)
            advice = data['farming_advice']
            sowing = data['sowing_recommendation']
        except:
             advice = ["Weather is tricky today. Check local news."]
             sowing = "Standard sowing time."
    else:
        advice = ["Gemini unavailable. Check local reports."]
        sowing = "Check calendar."

    return jsonify({
        "success": True,
        "weather": {
            "condition": condition,
            "temperature": temp,
            "humidity": humidity
        },
        "farming_advice": advice,
        "sowing_recommendation": sowing,
        "date": datetime.now().strftime("%Y-%m-%d")
    })
