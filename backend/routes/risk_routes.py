from flask import Blueprint, request, jsonify
import random
from datetime import datetime, timedelta

risk_bp = Blueprint('risk', __name__)

# Pest data by crop
PEST_DATA = {
    'rice': [
        {'name': 'Brown Planthopper', 'severity': 'High', 'baseProb': 35},
        {'name': 'Stem Borer', 'severity': 'High', 'baseProb': 40},
        {'name': 'Leaf Folder', 'severity': 'Medium', 'baseProb': 30},
        {'name': 'Gall Midge', 'severity': 'Medium', 'baseProb': 25}
    ],
    'wheat': [
        {'name': 'Aphids', 'severity': 'Medium', 'baseProb': 40},
        {'name': 'Termites', 'severity': 'High', 'baseProb': 30},
        {'name': 'Army Worm', 'severity': 'High', 'baseProb': 25},
        {'name': 'Rust Disease', 'severity': 'Severe', 'baseProb': 35}
    ],
    'cotton': [
        {'name': 'Bollworm', 'severity': 'Severe', 'baseProb': 45},
        {'name': 'Whitefly', 'severity': 'High', 'baseProb': 40},
        {'name': 'Aphids', 'severity': 'Medium', 'baseProb': 35},
        {'name': 'Jassids', 'severity': 'Medium', 'baseProb': 30}
    ],
    'tomato': [
        {'name': 'Fruit Borer', 'severity': 'High', 'baseProb': 45},
        {'name': 'Leaf Miner', 'severity': 'Medium', 'baseProb': 35},
        {'name': 'Whitefly', 'severity': 'High', 'baseProb': 40},
        {'name': 'Spider Mites', 'severity': 'Medium', 'baseProb': 30}
    ],
    'maize': [
        {'name': 'Fall Armyworm', 'severity': 'Severe', 'baseProb': 50},
        {'name': 'Stem Borer', 'severity': 'High', 'baseProb': 40},
        {'name': 'Aphids', 'severity': 'Medium', 'baseProb': 30},
        {'name': 'Cutworm', 'severity': 'Medium', 'baseProb': 25}
    ],
    'default': [
        {'name': 'Aphids', 'severity': 'Medium', 'baseProb': 35},
        {'name': 'Caterpillars', 'severity': 'Medium', 'baseProb': 30},
        {'name': 'Leaf Miners', 'severity': 'Low', 'baseProb': 25},
        {'name': 'Thrips', 'severity': 'Low', 'baseProb': 20}
    ]
}

# Disease data by crop
DISEASE_DATA = {
    'rice': [
        {'name': 'Blast Disease', 'stage': 'Early detection', 'action': 'Apply Tricyclazole fungicide'},
        {'name': 'Bacterial Blight', 'stage': 'Prevention', 'action': 'Use resistant varieties'},
        {'name': 'Sheath Blight', 'stage': 'Monitoring', 'action': 'Improve field drainage'}
    ],
    'wheat': [
        {'name': 'Yellow Rust', 'stage': 'Early detection', 'action': 'Apply Propiconazole'},
        {'name': 'Powdery Mildew', 'stage': 'Prevention', 'action': 'Apply sulfur-based fungicide'},
        {'name': 'Loose Smut', 'stage': 'Prevention', 'action': 'Use treated seeds'}
    ],
    'cotton': [
        {'name': 'Bacterial Blight', 'stage': 'Monitoring', 'action': 'Remove infected plants'},
        {'name': 'Root Rot', 'stage': 'Prevention', 'action': 'Improve drainage'},
        {'name': 'Leaf Curl Virus', 'stage': 'Early detection', 'action': 'Control whitefly vectors'}
    ],
    'tomato': [
        {'name': 'Early Blight', 'stage': 'Early detection', 'action': 'Apply Mancozeb fungicide'},
        {'name': 'Late Blight', 'stage': 'Critical', 'action': 'Remove affected plants immediately'},
        {'name': 'Fusarium Wilt', 'stage': 'Prevention', 'action': 'Use resistant varieties'}
    ],
    'default': [
        {'name': 'Fungal Infection', 'stage': 'Monitoring', 'action': 'Apply broad-spectrum fungicide'},
        {'name': 'Bacterial Disease', 'stage': 'Prevention', 'action': 'Improve air circulation'},
        {'name': 'Viral Disease', 'stage': 'Prevention', 'action': 'Control insect vectors'}
    ]
}

@risk_bp.route('/assess', methods=['POST'])
def assess_risk():
    """Comprehensive risk assessment for a crop"""
    try:
        data = request.json
        crop = data.get('crop', 'rice').lower()
        location = data.get('location', 'Hyderabad')
        weather = data.get('weather', {})
        
        # Get pest risks for this crop
        pests = PEST_DATA.get(crop, PEST_DATA['default'])
        pest_risks = []
        
        for pest in pests:
            # Adjust probability based on conditions
            humidity_factor = 1 + (weather.get('humidity', 60) - 60) / 100
            temp_factor = 1 if 25 <= weather.get('temperature', 28) <= 35 else 0.8
            
            probability = min(90, pest['baseProb'] * humidity_factor * temp_factor * random.uniform(0.8, 1.2))
            
            pest_risks.append({
                'name': pest['name'],
                'probability': round(probability),
                'severity': pest['severity'],
                'affectedArea': f"{random.randint(5, 20)}%",
                'trend': random.choice(['increasing', 'stable', 'decreasing'])
            })
        
        # Get weather risks
        weather_risks = generate_weather_risks(weather)
        
        # Get disease risks
        diseases = DISEASE_DATA.get(crop, DISEASE_DATA['default'])
        disease_risks = []
        
        for disease in diseases:
            probability = random.randint(15, 50)
            disease_risks.append({
                'name': disease['name'],
                'probability': probability,
                'stage': disease['stage'],
                'action': disease['action']
            })
        
        # Calculate overall risk score
        avg_pest = sum(p['probability'] for p in pest_risks) / len(pest_risks)
        avg_weather = sum(w['probability'] for w in weather_risks) / len(weather_risks)
        avg_disease = sum(d['probability'] for d in disease_risks) / len(disease_risks)
        
        overall_score = (avg_pest * 0.4 + avg_weather * 0.35 + avg_disease * 0.25)
        risk_level = 'Low' if overall_score < 30 else 'Medium' if overall_score < 55 else 'High'
        
        return jsonify({
            'success': True,
            'risks': {
                'pestRisks': pest_risks,
                'weatherRisks': weather_risks,
                'diseaseRisks': disease_risks
            },
            'overall': {
                'score': round(overall_score),
                'level': risk_level
            },
            'location': location,
            'crop': crop,
            'assessedAt': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def generate_weather_risks(weather):
    """Generate weather-related risks"""
    risks = []
    
    temp = weather.get('temperature', 28)
    humidity = weather.get('humidity', 60)
    rainfall = weather.get('rainfall', 5)
    wind = weather.get('windSpeed', 15)
    
    # Heat wave risk
    if temp > 30:
        heat_prob = min(80, 20 + (temp - 30) * 8)
        risks.append({
            'type': 'Heat Wave',
            'probability': round(heat_prob),
            'impact': 'Crop stress and water requirement increase',
            'timing': 'Next 3-5 days' if temp > 35 else 'Next week',
            'severity': 'Severe' if temp > 38 else 'High' if temp > 35 else 'Moderate'
        })
    
    # Heavy rainfall risk
    if rainfall > 5:
        rain_prob = min(85, 30 + rainfall * 5)
        risks.append({
            'type': 'Heavy Rainfall',
            'probability': round(rain_prob),
            'impact': 'Waterlogging and root damage risk',
            'timing': 'Next 48 hours',
            'severity': 'High' if rainfall > 15 else 'Moderate'
        })
    
    # Drought risk
    if rainfall < 2 and temp > 28:
        drought_prob = min(70, 30 + (30 - rainfall * 10))
        risks.append({
            'type': 'Drought Stress',
            'probability': round(drought_prob),
            'impact': 'Water shortage and yield reduction',
            'timing': 'Developing',
            'severity': 'High'
        })
    
    # Storm/wind risk
    if wind > 30:
        wind_prob = min(60, 20 + (wind - 30) * 4)
        risks.append({
            'type': 'Strong Winds',
            'probability': round(wind_prob),
            'impact': 'Physical damage to crops',
            'timing': 'Uncertain',
            'severity': 'Moderate' if wind < 50 else 'High'
        })
    
    # Fog/frost risk (for cooler conditions)
    if temp < 15:
        frost_prob = min(50, 20 + (15 - temp) * 5)
        risks.append({
            'type': 'Frost/Cold',
            'probability': round(frost_prob),
            'impact': 'Frost damage to tender crops',
            'timing': 'Early morning hours',
            'severity': 'Severe' if temp < 5 else 'Moderate'
        })
    
    # Hailstorm (random seasonal risk)
    if humidity > 70 and random.random() > 0.7:
        risks.append({
            'type': 'Hailstorm',
            'probability': random.randint(10, 30),
            'impact': 'Physical damage to fruits and leaves',
            'timing': 'Uncertain',
            'severity': 'Severe'
        })
    
    # Ensure at least one risk
    if not risks:
        risks.append({
            'type': 'Normal Conditions',
            'probability': 10,
            'impact': 'No significant weather threats',
            'timing': 'Current',
            'severity': 'Low'
        })
    
    return risks[:5]  # Return max 5 risks

@risk_bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Get current risk alerts for the region"""
    try:
        crop = request.args.get('crop', 'rice')
        
        weather_alerts = [
            {
                'id': 1,
                'type': 'warning',
                'title': 'Heavy Rain Alert',
                'message': 'Expected 80mm rainfall in next 48 hours. Prepare drainage systems.',
                'time': '2 hours ago',
                'severity': 'High'
            },
            {
                'id': 2,
                'type': 'info',
                'title': 'Temperature Rise',
                'message': 'Temperature expected to reach 38°C. Consider shade nets for sensitive crops.',
                'time': '5 hours ago',
                'severity': 'Medium'
            },
            {
                'id': 3,
                'type': 'success',
                'title': 'Favorable Conditions',
                'message': 'Good weather window for pesticide application in next 3 days.',
                'time': '1 day ago',
                'severity': 'Low'
            }
        ]
        
        pest_alerts = [
            {
                'id': 1,
                'type': 'danger',
                'title': 'Fall Armyworm Outbreak',
                'message': 'Detected in nearby regions. Start monitoring and prepare control measures.',
                'confidence': 85,
                'urgency': 'High'
            },
            {
                'id': 2,
                'type': 'warning',
                'title': 'Aphid Activity Increasing',
                'message': 'Rising humidity favors aphid population. Inspect leaf undersides.',
                'confidence': 72,
                'urgency': 'Medium'
            },
            {
                'id': 3,
                'type': 'info',
                'title': 'Beneficial Insects Active',
                'message': 'Natural predators helping control minor pest populations.',
                'confidence': 90,
                'urgency': 'Low'
            }
        ]
        
        return jsonify({
            'success': True,
            'weatherAlerts': weather_alerts,
            'pestAlerts': pest_alerts,
            'generatedAt': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@risk_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    """Get actionable recommendations based on risks"""
    try:
        data = request.json
        crop = data.get('crop', 'rice')
        risk_level = data.get('riskLevel', 'Medium')
        
        recommendations = []
        
        # General monitoring
        recommendations.append({
            'title': 'Monitor Fields Daily',
            'description': 'Check for early signs of pest damage, especially leaf undersides',
            'priority': 'High',
            'icon': '👁️'
        })
        
        # Weather-based
        recommendations.append({
            'title': 'Prepare Drainage',
            'description': 'Heavy rain expected - clear channels and check pump systems',
            'priority': 'High',
            'icon': '💧'
        })
        
        # Pest control
        recommendations.append({
            'title': 'Apply Neem Oil',
            'description': 'Natural pest deterrent - spray in early morning or evening',
            'priority': 'Medium',
            'icon': '🌿'
        })
        
        # Monitoring tools
        recommendations.append({
            'title': 'Install Pheromone Traps',
            'description': 'For Fall Armyworm monitoring - place 5 per hectare',
            'priority': 'Medium',
            'icon': '🪤'
        })
        
        # Irrigation
        recommendations.append({
            'title': 'Adjust Irrigation',
            'description': 'Reduce watering before expected rainfall to prevent waterlogging',
            'priority': 'Medium',
            'icon': '🚿'
        })
        
        # Harvest planning
        recommendations.append({
            'title': 'Schedule Harvesting',
            'description': 'Plan harvest before predicted weather disruption',
            'priority': 'Low' if risk_level == 'Low' else 'High',
            'icon': '🌾'
        })
        
        if risk_level == 'High':
            recommendations.append({
                'title': 'Consider Crop Insurance',
                'description': 'High risk detected - protect your investment with insurance',
                'priority': 'High',
                'icon': '🛡️'
            })
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
