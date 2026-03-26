from flask import Blueprint, request, jsonify
from models.ml_models import disease_model
import os
from PIL import Image
import io

disease_bp = Blueprint('disease_bp', __name__)

@disease_bp.route('/detect', methods=['POST'])
def detect_disease():
    try:
        language = request.form.get('language', 'en')
        image_data = None
        if 'image' in request.files:
            file = request.files['image']
            # Convert file bytes to PIL Image for the GenAI SDK securely
            image_bytes = file.read()
            if image_bytes:
                image_data = Image.open(io.BytesIO(image_bytes))
                
                # If the image is transparent PNG or similar, convert to RGB
                if image_data.mode != 'RGB':
                    image_data = image_data.convert('RGB')
        
        name, symptoms, treatment_steps = disease_model.predict(image_data, language)
        
        return jsonify({
            "success": True,
            "disease": name,
            "symptoms": symptoms,
            "treatment_steps": treatment_steps,
            "confidence": 0.95 # Generic confidence, could extract from Gemini output later
        })
    except Exception as e:
        print("Disease Route Error", e)
        return jsonify({"success": False, "error": str(e)}), 500
