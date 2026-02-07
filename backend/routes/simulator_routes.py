from flask import Blueprint, request, jsonify
import random
from datetime import datetime, timedelta

simulator_bp = Blueprint('simulator', __name__)

# Base yield data per hectare (tonnes)
BASE_YIELDS = {
    'wheat': 4.5, 'rice': 5.0, 'cotton': 2.5, 'sugarcane': 70,
    'maize': 6.0, 'soybean': 2.0, 'groundnut': 1.8, 'tomato': 25,
    'onion': 18, 'potato': 22, 'bajra': 2.5, 'chana': 1.5
}

# Market prices per quintal (INR)
MARKET_PRICES = {
    'wheat': 2200, 'rice': 2100, 'cotton': 6500, 'sugarcane': 350,
    'maize': 1850, 'soybean': 4500, 'groundnut': 5500, 'tomato': 2800,
    'onion': 1500, 'potato': 1200, 'bajra': 2000, 'chana': 5200
}

# Cost factors
COST_FACTORS = {
    'seed': 2000,  # per hectare
    'labor': 5000,  # per hectare
    'irrigation': {
        'drip': 8000, 'sprinkler': 6000, 'flood': 3000, 'rainfed': 1000
    },
    'fertilizer': 1.2  # multiplier for budget
}

@simulator_bp.route('/run', methods=['POST'])
def run_simulation():
    """Run a complete farm simulation"""
    try:
        data = request.json
        farm_config = data.get('farmConfig', {})
        weather_conditions = data.get('weatherConditions', {})
        
        crop_type = farm_config.get('cropType', 'wheat')
        field_area = float(farm_config.get('fieldArea', 5))
        soil_type = farm_config.get('soilType', 'loamy')
        irrigation_type = farm_config.get('irrigationType', 'drip')
        fertilizer_budget = float(farm_config.get('fertilizerBudget', 5000))
        season_duration = int(farm_config.get('seasonDuration', 120))
        
        temperature = float(weather_conditions.get('temperature', 28))
        humidity = float(weather_conditions.get('humidity', 65))
        rainfall = float(weather_conditions.get('rainfall', 2.5))
        
        # Calculate weather impact factor
        weather_factor = calculate_weather_impact(temperature, humidity, rainfall)
        
        # Calculate soil factor
        soil_factor = calculate_soil_factor(soil_type, crop_type)
        
        # Calculate irrigation efficiency
        irrigation_factor = calculate_irrigation_factor(irrigation_type, rainfall)
        
        # Calculate fertilizer impact
        fertilizer_factor = min(1.3, 0.7 + (fertilizer_budget / 10000))
        
        # Base yield calculation
        base_yield = BASE_YIELDS.get(crop_type, 3.0) * field_area
        
        # Final yield prediction
        final_yield = base_yield * weather_factor * soil_factor * irrigation_factor * fertilizer_factor
        final_yield = round(final_yield, 2)
        
        # Cost calculation
        seed_cost = COST_FACTORS['seed'] * field_area
        labor_cost = COST_FACTORS['labor'] * field_area
        irrigation_cost = COST_FACTORS['irrigation'].get(irrigation_type, 5000) * field_area / 10
        total_cost = seed_cost + labor_cost + irrigation_cost + (fertilizer_budget * COST_FACTORS['fertilizer'])
        
        # Revenue and profit calculation
        market_price = MARKET_PRICES.get(crop_type, 2000)
        revenue = final_yield * 10 * market_price  # Convert tonnes to quintals
        profit = revenue - total_cost
        profit_margin = (profit / revenue * 100) if revenue > 0 else 0
        
        # Risk assessment
        risk_score = calculate_risk_score(weather_factor, soil_factor, humidity, temperature)
        risk_level = 'Low' if risk_score < 30 else 'Medium' if risk_score < 60 else 'High'
        
        # Generate recommendations
        recommendations = generate_recommendations(
            crop_type, weather_conditions, soil_type, irrigation_type, risk_level
        )
        
        # Generate weather risks
        weather_risks = generate_weather_risks(weather_conditions)
        
        return jsonify({
            'success': True,
            'results': {
                'predictedYield': final_yield,
                'unit': 'tonnes',
                'estimatedRevenue': round(revenue),
                'estimatedCost': round(total_cost),
                'estimatedProfit': round(profit),
                'profitMargin': round(profit_margin, 1),
                'riskLevel': risk_level,
                'riskScore': round(risk_score),
                'factors': {
                    'weather': round(weather_factor, 2),
                    'soil': round(soil_factor, 2),
                    'irrigation': round(irrigation_factor, 2),
                    'fertilizer': round(fertilizer_factor, 2)
                },
                'recommendations': recommendations,
                'weatherRisks': weather_risks,
                'dailyProjections': generate_daily_projections(season_duration, final_yield)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def calculate_weather_impact(temperature, humidity, rainfall):
    """Calculate weather impact on crop yield"""
    impact = 1.0
    
    # Temperature impact
    if temperature < 15:
        impact *= 0.7
    elif temperature > 40:
        impact *= 0.6
    elif temperature > 35:
        impact *= 0.85
    elif 20 <= temperature <= 32:
        impact *= 1.1
    
    # Humidity impact
    if humidity < 40:
        impact *= 0.85
    elif humidity > 90:
        impact *= 0.8
    elif 60 <= humidity <= 80:
        impact *= 1.05
    
    # Rainfall impact
    if rainfall < 1:
        impact *= 0.75
    elif rainfall > 15:
        impact *= 0.7
    elif 2 <= rainfall <= 8:
        impact *= 1.1
    
    return max(0.4, min(1.3, impact))

def calculate_soil_factor(soil_type, crop_type):
    """Calculate soil suitability factor"""
    soil_crop_matrix = {
        'loamy': {'wheat': 1.2, 'rice': 1.1, 'cotton': 1.15, 'tomato': 1.2, 'default': 1.1},
        'clay': {'rice': 1.2, 'wheat': 0.9, 'sugarcane': 1.1, 'default': 0.95},
        'sandy': {'groundnut': 1.15, 'potato': 1.1, 'carrot': 1.2, 'default': 0.85},
        'black': {'cotton': 1.25, 'soybean': 1.2, 'wheat': 1.15, 'default': 1.1},
        'red': {'groundnut': 1.1, 'maize': 1.05, 'default': 0.95}
    }
    
    soil_factors = soil_crop_matrix.get(soil_type, {'default': 1.0})
    return soil_factors.get(crop_type, soil_factors.get('default', 1.0))

def calculate_irrigation_factor(irrigation_type, rainfall):
    """Calculate irrigation efficiency factor"""
    base_factors = {
        'drip': 1.25,
        'sprinkler': 1.15,
        'flood': 0.95,
        'rainfed': 0.7 + (min(rainfall, 10) / 20)
    }
    return base_factors.get(irrigation_type, 1.0)

def calculate_risk_score(weather_factor, soil_factor, humidity, temperature):
    """Calculate overall risk score (0-100)"""
    risk = 50  # Base risk
    
    # Weather factor impact
    if weather_factor < 0.8:
        risk += 20
    elif weather_factor > 1.1:
        risk -= 15
    
    # Soil factor impact
    if soil_factor < 1.0:
        risk += 10
    
    # Humidity risk
    if humidity > 85:
        risk += 15  # Disease risk
    elif humidity < 40:
        risk += 10  # Drought stress
    
    # Temperature risk
    if temperature > 38 or temperature < 12:
        risk += 20
    
    return max(0, min(100, risk))

def generate_recommendations(crop_type, weather, soil_type, irrigation_type, risk_level):
    """Generate actionable recommendations"""
    recommendations = []
    
    # Irrigation recommendations
    if irrigation_type != 'drip':
        recommendations.append('Consider switching to drip irrigation to save 40% water and improve yield')
    
    # Weather-based recommendations
    if weather.get('temperature', 25) > 35:
        recommendations.append('Install shade nets or mulching to protect crops from heat stress')
    
    if weather.get('humidity', 60) > 80:
        recommendations.append('Monitor for fungal diseases due to high humidity - ensure good air circulation')
    
    if weather.get('rainfall', 5) > 10:
        recommendations.append('Prepare drainage channels to prevent waterlogging')
    
    # Soil recommendations
    if soil_type == 'sandy':
        recommendations.append('Apply organic matter to improve water retention in sandy soil')
    elif soil_type == 'clay':
        recommendations.append('Improve drainage and add gypsum to reduce soil compaction')
    
    # Risk-based recommendations
    if risk_level == 'High':
        recommendations.append('Consider crop insurance to protect against potential losses')
        recommendations.append('Diversify crops to spread risk')
    
    # General recommendations
    recommendations.append(f'Optimal harvest window: Days 100-120 for best quality')
    
    return recommendations[:6]  # Return top 6 recommendations

def generate_weather_risks(weather_conditions):
    """Generate potential weather risks"""
    risks = []
    
    temp = weather_conditions.get('temperature', 25)
    humidity = weather_conditions.get('humidity', 60)
    rainfall = weather_conditions.get('rainfall', 5)
    
    if temp > 32:
        risks.append({
            'risk': 'Heat Wave',
            'probability': min(80, 30 + (temp - 32) * 10),
            'impact': 'Severe' if temp > 38 else 'Moderate'
        })
    
    if rainfall > 8:
        risks.append({
            'risk': 'Heavy Rainfall',
            'probability': min(85, 40 + rainfall * 3),
            'impact': 'High' if rainfall > 15 else 'Moderate'
        })
    
    if humidity > 75:
        risks.append({
            'risk': 'Pest Outbreak',
            'probability': min(70, 20 + (humidity - 75) * 2),
            'impact': 'High'
        })
    
    if rainfall < 2 and temp > 30:
        risks.append({
            'risk': 'Drought Stress',
            'probability': min(75, 40 + (35 - min(rainfall * 10, 30))),
            'impact': 'Severe'
        })
    
    # Add default risk if none detected
    if not risks:
        risks.append({
            'risk': 'Normal Weather',
            'probability': 10,
            'impact': 'Low'
        })
    
    return risks[:4]

def generate_daily_projections(season_duration, final_yield):
    """Generate daily yield projections"""
    projections = []
    growth_curve = [0.1, 0.15, 0.25, 0.35, 0.15]  # Growth distribution across stages
    
    for day in range(1, season_duration + 1, 7):  # Weekly projections
        stage_index = min(4, int((day / season_duration) * 5))
        cumulative_growth = sum(growth_curve[:stage_index + 1]) * (day / (season_duration / 5 * (stage_index + 1)))
        projected_yield = final_yield * min(1, cumulative_growth)
        
        projections.append({
            'day': day,
            'projectedYield': round(projected_yield, 2),
            'growthStage': ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Mature'][stage_index]
        })
    
    return projections

@simulator_bp.route('/quick-estimate', methods=['POST'])
def quick_estimate():
    """Quick yield estimation without full simulation"""
    try:
        data = request.json
        crop = data.get('crop', 'wheat')
        area = float(data.get('area', 1))
        
        base_yield = BASE_YIELDS.get(crop, 3.0)
        estimated_yield = base_yield * area * random.uniform(0.85, 1.15)
        market_price = MARKET_PRICES.get(crop, 2000)
        estimated_revenue = estimated_yield * 10 * market_price
        
        return jsonify({
            'success': True,
            'estimate': {
                'yield': round(estimated_yield, 2),
                'unit': 'tonnes',
                'revenue': round(estimated_revenue),
                'price': market_price
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
