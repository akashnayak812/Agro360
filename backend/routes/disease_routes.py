from flask import Blueprint, request, jsonify
from models.ml_models import disease_model
import os

disease_bp = Blueprint('disease_bp', __name__)

@disease_bp.route('/detect', methods=['POST'])
def detect_disease():
    try:
        language = request.form.get('language', 'en')
        image_data = None
        if 'image' in request.files:
            file = request.files['image']
            # Read file bytes
            image_data = file.read()
        
        name, symptoms, treatment_steps = disease_model.predict(image_data, language)
        
        return jsonify({
            "success": True,
            "disease": name,
            "symptoms": symptoms,
            "treatment_steps": treatment_steps,
            "confidence": 0.95 # Mock
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
