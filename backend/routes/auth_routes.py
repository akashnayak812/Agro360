from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from models.user import UserModel
from email_validator import validate_email, EmailNotValidError

auth_bp = Blueprint('auth', __name__)

# This will be initialized in app.py when we have access to the db
user_model = None

def init_auth_routes(db):
    global user_model
    user_model = UserModel(db)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if not email or not password or not name:
        return jsonify({"msg": "Missing required fields"}), 400

    try:
        validate_email(email, check_deliverability=False)
    except EmailNotValidError:
        return jsonify({"msg": "Invalid email address"}), 400

    if not user_model:
        return jsonify({"msg": "Server configuration error"}), 500

    user_id, error = user_model.create_user(email, password, name)
    if error:
        return jsonify({"msg": error}), 400

    access_token = create_access_token(identity=user_id)
    return jsonify({
        "msg": "Registration successful", 
        "access_token": access_token,
        "user": {"email": email, "name": name, "id": user_id}
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400
    
    if not user_model:
        return jsonify({"msg": "Server configuration error"}), 500

    user = user_model.find_by_email(email)
    if not user or not user_model.verify_password(user.password, password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "msg": "Login successful",
        "access_token": access_token,
        "user": user.to_json()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user_id = get_jwt_identity()
    user = user_model.find_by_id(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(user.to_json()), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@auth_bp.route('/personal-info', methods=['PUT'])
@jwt_required()
def update_personal_info():
    """Update user's personal information."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({"msg": "No data provided"}), 400
    
    # Personal info can include: phone, address, farm_size, crops, etc.
    personal_info = {
        'phone': data.get('phone'),
        'address': data.get('address'),
        'city': data.get('city'),
        'state': data.get('state'),
        'pincode': data.get('pincode'),
        'farm_size': data.get('farm_size'),
        'crops_grown': data.get('crops_grown', []),
        'soil_type': data.get('soil_type'),
        'irrigation_type': data.get('irrigation_type'),
    }
    
    # Remove None values
    personal_info = {k: v for k, v in personal_info.items() if v is not None}
    
    if user_model.update_personal_info(current_user_id, personal_info):
        return jsonify({"msg": "Personal information updated successfully"}), 200
    else:
        return jsonify({"msg": "Failed to update personal information"}), 500

@auth_bp.route('/recent-searches', methods=['POST'])
@jwt_required()
def add_recent_search():
    """Add a search to user's recent searches."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'type' not in data:
        return jsonify({"msg": "Search type is required"}), 400
    
    # Search data structure: type, query, results_count, etc.
    search_data = {
        'type': data.get('type'),  # e.g., 'crop', 'disease', 'fertilizer', 'soil'
        'query': data.get('query'),
        'result': data.get('result'),
    }
    
    if user_model.add_recent_search(current_user_id, search_data):
        return jsonify({"msg": "Search added successfully"}), 200
    else:
        return jsonify({"msg": "Failed to add search"}), 500

@auth_bp.route('/recent-searches', methods=['GET'])
@jwt_required()
def get_recent_searches():
    """Get user's recent searches."""
    current_user_id = get_jwt_identity()
    searches = user_model.get_recent_searches(current_user_id)
    return jsonify({"recent_searches": searches}), 200

@auth_bp.route('/recent-searches', methods=['DELETE'])
@jwt_required()
def clear_recent_searches():
    """Clear user's recent searches."""
    current_user_id = get_jwt_identity()
    if user_model.clear_recent_searches(current_user_id):
        return jsonify({"msg": "Recent searches cleared successfully"}), 200
    else:
        return jsonify({"msg": "Failed to clear recent searches"}), 500
