from flask import Blueprint, request, jsonify, current_app
from models.ml_models import crop_model
from services.location_service import convert_simple_to_technical, get_soil_data_by_type, SOIL_TYPE_DATA
from services.decision_engine import run_decision_engine
import numpy as np

crop_bp = Blueprint('crop_bp', __name__)

@crop_bp.route('/recommend', methods=['POST'])
def recommend_crop():
    try:
        data = request.json
        language = data.get('language', 'en')
        # Expecting: {"N": 90, "P": 42, "K": 43, "temperature": 20.8, "humidity": 82, "ph": 6.5, "rainfall": 202.9}
        features = [
            float(data.get('N')),
            float(data.get('P')),
            float(data.get('K')),
            float(data.get('temperature', 25)), # Default fallback
            float(data.get('humidity', 70)),
            float(data.get('ph', 6.5)),
            float(data.get('rainfall', 100))
        ]
        
        prediction, confidence = crop_model.predict(np.array([features]))
        
        # --- Decision engine integration (NEW) ---
        decision = None
        try:
            decision_inputs = {
                "N": features[0], "P": features[1], "K": features[2],
                "temperature": features[3], "humidity": features[4],
                "ph": features[5], "rainfall": features[6],
            }
            decision = run_decision_engine(decision_inputs, prediction, language)
        except Exception as de_err:
            current_app.logger.warning("Decision engine error: %s", de_err)
        # --- End decision engine integration ---
        
        # Translate message and prediction if needed
        message = f"Based on the soil and weather conditions, {prediction} is the best suitable crop."
        if language and language != 'en':
            from services.gemini_service import gemini_service
            translated_pred = gemini_service.translate_text(prediction, language)
            prompt = f"Translate the following recommendation message. Replace the English crop name with the translated crop name. Return ONLY the translated string:\n\n{message}"
            translated_msg = gemini_service.generate_response(prompt, language)
            
            prediction = translated_pred if translated_pred else prediction
            message = translated_msg.strip() if translated_msg else message

        return jsonify({
            "success": True,
            "crop": prediction,
            "confidence": confidence,
            "message": message,
            "decision": decision
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@crop_bp.route('/recommend-simple', methods=['POST'])
def recommend_crop_simple():
    """
    Simple mode for uneducated farmers.
    Accepts: {
        state: "Telangana",
        district: "Hyderabad",
        soil_type: "black_sticky" (optional - visual selection),
        water: "normal" | "good" | "heavy" | "less" | "very_less" (optional)
    }
    """
    try:
        data = request.json
        language = data.get('language', 'en')
        
        # Convert simple inputs to technical values
        technical = convert_simple_to_technical(data)
        
        # Override with soil type if provided
        if 'soil_type' in data:
            soil_data = get_soil_data_by_type(data['soil_type'])
            if soil_data.get('success'):
                technical['N'] = soil_data['N']
                technical['P'] = soil_data['P']
                technical['K'] = soil_data['K']
                technical['ph'] = soil_data['ph']
        
        # Prepare features for model
        features = [
            float(technical.get('N', 40)),
            float(technical.get('P', 35)),
            float(technical.get('K', 40)),
            float(technical.get('temperature', 25)),
            float(technical.get('humidity', 70)),
            float(technical.get('ph', 6.5)),
            float(technical.get('rainfall', 100))
        ]
        
        prediction, confidence = crop_model.predict(np.array([features]))
        
        # Get soil type info for response
        soil_info = SOIL_TYPE_DATA.get(data.get('soil_type', ''), {})
        
        # --- Decision engine integration (NEW) ---
        decision = None
        try:
            decision_inputs = {
                "N": technical.get('N', features[0]),
                "P": technical.get('P', features[1]),
                "K": technical.get('K', features[2]),
                "temperature": technical.get('temperature', features[3]),
                "humidity": technical.get('humidity', features[4]),
                "ph": technical.get('ph', features[5]),
                "rainfall": technical.get('rainfall', features[6]),
            }
            decision = run_decision_engine(decision_inputs, prediction, language)
        except Exception as de_err:
            current_app.logger.warning("Decision engine error (simple): %s", de_err)
        # --- End decision engine integration ---
        
        # Translate message and prediction if needed
        message = f"Based on your location and soil, {prediction} is the best crop for you!"
        if language and language != 'en':
            from services.gemini_service import gemini_service
            translated_pred = gemini_service.translate_text(prediction, language)
            prompt = f"Translate the following recommendation message. Replace the English crop name with the translated crop name. Return ONLY the translated string:\n\n{message}"
            translated_msg = gemini_service.generate_response(prompt, language)
            
            prediction = translated_pred if translated_pred else prediction
            message = translated_msg.strip() if translated_msg else message

        return jsonify({
            "success": True,
            "crop": prediction,
            "confidence": confidence,
            "message": message,
            "location": {
                "state": data.get('state'),
                "district": data.get('district')
            },
            "detected_values": {
                "N": technical.get('N'),
                "P": technical.get('P'),
                "K": technical.get('K'),
                "ph": technical.get('ph'),
                "temperature": technical.get('temperature'),
                "humidity": technical.get('humidity'),
                "rainfall": technical.get('rainfall')
            },
            "soil_info": {
                "type": data.get('soil_type'),
                "name": soil_info.get('name', 'Unknown'),
                "recommended_crops": soil_info.get('crops', [])
            },
            "decision": decision
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
