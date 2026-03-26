from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import UserModel, User, db

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(current_user_id)
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
            
        return jsonify({
            'success': True,
            'user': user.to_json()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@profile_bp.route('/farm', methods=['POST'])
@jwt_required()
def update_farm_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(current_user_id)
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
            
        data = request.json
        farm_data = data.get('farm', {})
        
        # Merge with existing personal_info
        import json
        existing_info = json.loads(user.personal_info) if user.personal_info else {}
        existing_info['farm'] = farm_data
        
        # update_personal_info expects a dict and serializes it to JSON internally
        user.update_personal_info(existing_info)
        
        return jsonify({
            'success': True,
            'message': 'Farm profile updated successfully',
            'user': user.to_json()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
