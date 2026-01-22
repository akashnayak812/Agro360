"""
Location-based routes for auto-fetching weather and regional soil data.
Helps farmers by automatically getting climate and soil information.
"""
from flask import Blueprint, request, jsonify
from services.location_service import (
    get_weather_by_location,
    get_weather_by_coordinates,
    get_regional_soil_data,
    get_soil_data_by_type,
    convert_simple_to_technical,
    STATES_DISTRICTS,
    SOIL_TYPE_DATA,
    WATER_AVAILABILITY
)

location_bp = Blueprint('location_bp', __name__)


@location_bp.route('/states', methods=['GET'])
def get_states():
    """Get list of all available states"""
    return jsonify({
        "success": True,
        "states": list(STATES_DISTRICTS.keys())
    })


@location_bp.route('/districts/<state>', methods=['GET'])
def get_districts(state):
    """Get list of districts for a state"""
    districts = STATES_DISTRICTS.get(state, [])
    return jsonify({
        "success": True,
        "state": state,
        "districts": districts
    })


@location_bp.route('/weather', methods=['POST'])
def get_weather():
    """
    Get weather data for a location.
    Accepts either {lat, lon} or {state, district}
    """
    try:
        data = request.json
        
        if 'lat' in data and 'lon' in data:
            weather = get_weather_by_coordinates(data['lat'], data['lon'])
        elif 'state' in data and 'district' in data:
            weather = get_weather_by_location(data['state'], data['district'])
        else:
            return jsonify({
                "success": False,
                "error": "Please provide either lat/lon or state/district"
            }), 400
        
        return jsonify({
            "success": True,
            **weather
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@location_bp.route('/soil/regional', methods=['POST'])
def get_soil_by_region():
    """
    Get average soil data for a region.
    Accepts: {state, district}
    """
    try:
        data = request.json
        state = data.get('state')
        district = data.get('district')
        
        if not state or not district:
            return jsonify({
                "success": False,
                "error": "Please provide state and district"
            }), 400
        
        soil_data = get_regional_soil_data(state, district)
        return jsonify(soil_data)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@location_bp.route('/soil/types', methods=['GET'])
def get_soil_types():
    """Get all available soil types with their properties"""
    soil_types = []
    for key, data in SOIL_TYPE_DATA.items():
        soil_types.append({
            "id": key,
            "name": data["name"],
            "local_names": data["local_names"],
            "description": data["description"],
            "recommended_crops": data["crops"],
            "estimated_values": {
                "N": data["N"],
                "P": data["P"],
                "K": data["K"],
                "ph": data["ph"]
            }
        })
    
    return jsonify({
        "success": True,
        "soil_types": soil_types
    })


@location_bp.route('/soil/by-type', methods=['POST'])
def get_soil_values_by_type():
    """
    Get NPK values based on visual soil type selection.
    Accepts: {soil_type: "black_sticky" | "red_sandy" | "brown_loamy" | "yellow_clay" | "alluvial"}
    """
    try:
        data = request.json
        soil_type = data.get('soil_type')
        
        if not soil_type:
            return jsonify({
                "success": False,
                "error": "Please provide soil_type"
            }), 400
        
        soil_data = get_soil_data_by_type(soil_type)
        return jsonify(soil_data)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@location_bp.route('/water-levels', methods=['GET'])
def get_water_levels():
    """Get all water availability options"""
    water_levels = []
    for key, data in WATER_AVAILABILITY.items():
        water_levels.append({
            "id": key,
            "rainfall_mm": data["rainfall"],
            "labels": data["label"]
        })
    
    return jsonify({
        "success": True,
        "water_levels": water_levels
    })


@location_bp.route('/auto-fill', methods=['POST'])
def auto_fill_data():
    """
    Auto-fill all data based on location.
    Accepts: {state, district}
    Returns: Weather + Soil data combined
    """
    try:
        data = request.json
        state = data.get('state')
        district = data.get('district')
        
        if not state or not district:
            return jsonify({
                "success": False,
                "error": "Please provide state and district"
            }), 400
        
        # Get weather
        weather = get_weather_by_location(state, district)
        
        # Get soil
        soil = get_regional_soil_data(state, district)
        
        return jsonify({
            "success": True,
            "location": {"state": state, "district": district},
            "weather": weather,
            "soil": {
                "N": soil["N"],
                "P": soil["P"],
                "K": soil["K"],
                "ph": soil["ph"],
                "soil_type": soil.get("soil_type", "unknown")
            },
            "source": soil.get("source", "Regional data")
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@location_bp.route('/convert-simple', methods=['POST'])
def convert_simple_inputs():
    """
    Convert farmer-friendly inputs to technical values.
    Accepts: {
        state: "Telangana",
        district: "Hyderabad",
        soil_type: "black_sticky" (optional),
        water: "normal" (optional)
    }
    Returns: Technical values for ML models
    """
    try:
        data = request.json
        result = convert_simple_to_technical(data)
        
        return jsonify({
            "success": True,
            "technical_values": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
