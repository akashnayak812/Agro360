from flask import Blueprint, request, jsonify
from models.farm_data import UserFarmData
from extensions import db

farm_bp = Blueprint('farm_data', __name__)

@farm_bp.route('/<user_id>', methods=['GET'])
def get_farm_data(user_id):
    try:
        farm_data = UserFarmData.get_by_user_id(user_id)
        if not farm_data:
            return jsonify({'success': False, 'message': 'Farm data not found for this user'}), 404
            
        return jsonify({
            'success': True,
            'data': farm_data.to_json()
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@farm_bp.route('', methods=['POST'])
def create_farm_data():
    try:
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({'success': False, 'message': 'userId is required'}), 400
            
        # Check if already exists
        existing_data = UserFarmData.get_by_user_id(user_id)
        if existing_data:
            return jsonify({'success': False, 'message': 'Farm data already exists. Use PUT to update.'}), 409
            
        new_farm_data = UserFarmData(
            userId=user_id,
            activeCrops=data.get('activeCrops', 0),
            monthlyIncome=data.get('monthlyIncome', 0.0),
            landArea=data.get('landArea', 0.0)
        )
        
        db.session.add(new_farm_data)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Farm data created successfully',
            'data': new_farm_data.to_json()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@farm_bp.route('/<user_id>', methods=['PUT'])
def update_farm_data(user_id):
    try:
        data = request.json
        farm_data = UserFarmData.get_by_user_id(user_id)
        
        if not farm_data:
            return jsonify({'success': False, 'message': 'Farm data not found'}), 404
            
        if 'activeCrops' in data:
            farm_data.activeCrops = data['activeCrops']
        if 'monthlyIncome' in data:
            farm_data.monthlyIncome = data['monthlyIncome']
        if 'landArea' in data:
            farm_data.landArea = data['landArea']
            
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Farm data updated successfully',
            'data': farm_data.to_json()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
