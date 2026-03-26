from flask import Blueprint, jsonify, request
from services.gemini_service import gemini_service
from datetime import datetime
import json

advisory_bp = Blueprint('advisory_bp', __name__)

@advisory_bp.route('/current', methods=['GET', 'POST'])
def get_advisory():
    if request.method == 'POST':
        data = request.json or {}
        language = data.get('language', 'en')
        weather_data = data.get('weather')
        farm_profile = data.get('farmProfile')
    else:
        language = request.args.get('language', 'en')
        weather_data = None
        farm_profile = None

    if weather_data:
        condition = weather_data.get('condition', 'Cloudy')
        temp = weather_data.get('temperature', 25)
        humidity = weather_data.get('humidity', 60)
        wind_speed = weather_data.get('windSpeed', 12)
    else:
        # In real app, fetch real weather. Here we simulate random valid weather.
        import random
        weather_conditions = ["Sunny", "Rainy", "Cloudy", "Windy"]
        condition = random.choice(weather_conditions)
        temp = random.randint(20, 35)
        humidity = random.randint(40, 90)
        wind_speed = random.randint(5, 25)

    farm_context = ""
    if farm_profile:
        crop = farm_profile.get('defaultCrop', 'unknown crop')
        soil = farm_profile.get('soilType', 'unknown soil type')
        loc = f"{farm_profile.get('district', '')}, {farm_profile.get('state', '')}"
        farm_context = f"\nContext: The farmer is currently growing {crop} in {soil} located in {loc}."

    prompt = f"""
    Generate agricultural advice for today.{farm_context}
    Weather: {condition}, {temp}°C, {humidity}% humidity.
    Date: {datetime.now().strftime("%Y-%m-%d")}
    
    Return JSON: 
    {{ 
        "farming_advice": ["tip1", "tip2"], 
        "sowing_recommendation": "One sentence about what to sow now given the weather and farm context." 
    }}
    """
    
    response = gemini_service.generate_response(prompt, language)
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
            "humidity": humidity,
            "windSpeed": wind_speed
        },
        "farming_advice": advice,
        "sowing_recommendation": sowing,
        "date": datetime.now().strftime("%Y-%m-%d")
    })
