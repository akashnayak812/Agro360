from flask import Blueprint, request, jsonify
from models.ml_models import disease_model
import os

disease_bp = Blueprint('disease_bp', __name__)

@disease_bp.route('/detect', methods=['POST'])
def detect_disease():
    try:
        image_data = None
        if 'image' in request.files:
            file = request.files['image']
            # Read file bytes
            image_data = file.read()
        
        name, symptoms, treatment = disease_model.predict(image_data)
        
        return jsonify({
            "success": True,
            "disease": name,
            "symptoms": symptoms,
            "treatment": treatment,
            "confidence": 0.95 # Mock
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
