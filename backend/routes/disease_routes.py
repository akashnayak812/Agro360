from flask import Blueprint, request, jsonify
from models.ml_models import disease_model
import os

disease_bp = Blueprint('disease_bp', __name__)

@disease_bp.route('/detect', methods=['POST'])
def detect_disease():
    try:
        # In a real app, we would handle file upload here
        # file = request.files['image']
        
        # For mock/demo, assuming we just trigger the logic
        name, symptoms, treatment = disease_model.predict(None)
        
        return jsonify({
            "success": True,
            "disease": name,
            "symptoms": symptoms,
            "treatment": treatment,
            "confidence": 0.95 # Mock
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
