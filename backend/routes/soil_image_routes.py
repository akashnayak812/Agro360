from flask import Blueprint, request, jsonify
from services.soil_image_analyzer import soil_analyzer
import os

soil_image_bp = Blueprint('soil_image_bp', __name__)

@soil_image_bp.route('/analyze-image', methods=['POST'])
def analyze_soil_image():
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400

    try:
        # Read file into memory
        image_bytes = file.read()
        
        # Analyze
        result = soil_analyzer.analyze_image(image_bytes)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
