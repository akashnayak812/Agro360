from flask import Blueprint, request, jsonify
import random
from datetime import datetime, timedelta
from services.market_service import MarketService

market_bp = Blueprint('market', __name__)

# Base prices per quintal (INR)
BASE_PRICES = {
    'wheat': 2200, 'rice': 2100, 'maize': 1850, 'bajra': 2000,
    'chana': 5200, 'moong': 7500, 'urad': 6800, 'masoor': 5800,
    'tomato': 2800, 'onion': 1500, 'potato': 1200, 'cabbage': 800,
    'cauliflower': 1200, 'brinjal': 1500, 'okra': 2000,
    'soybean': 4500, 'groundnut': 5500, 'mustard': 5200, 'sunflower': 5800,
    'cotton': 6500, 'sugarcane': 350, 'jute': 4500, 'tobacco': 5000
}

# MSP (Minimum Support Price) for key crops
MSP_PRICES = {
    'wheat': 2125, 'rice': 2040, 'maize': 1850, 'bajra': 2250,
    'chana': 5230, 'moong': 7755, 'urad': 6600, 'masoor': 6000,
    'soybean': 4300, 'groundnut': 5850, 'mustard': 5050, 'sunflower': 5650,
    'cotton': 6080, 'sugarcane': 305, 'jute': 4750
}

# Market locations
MARKETS = {
    'delhi': {'name': 'Delhi (Azadpur)', 'state': 'Delhi'},
    'mumbai': {'name': 'Mumbai (Vashi)', 'state': 'Maharashtra'},
    'hyderabad': {'name': 'Hyderabad (Bowenpally)', 'state': 'Telangana'},
    'chennai': {'name': 'Chennai (Koyambedu)', 'state': 'Tamil Nadu'},
    'bangalore': {'name': 'Bangalore (Yeshwantpur)', 'state': 'Karnataka'},
    'kolkata': {'name': 'Kolkata (Burrabazar)', 'state': 'West Bengal'},
    'pune': {'name': 'Pune (Market Yard)', 'state': 'Maharashtra'},
    'ahmedabad': {'name': 'Ahmedabad (APMC)', 'state': 'Gujarat'}
}

@market_bp.route('/prices', methods=['POST'])
def get_prices():
    """Get current market prices for a crop"""
    try:
        data = request.json
        crop = data.get('crop', 'wheat').lower()
        market = data.get('market', 'all')
        
        base_price = BASE_PRICES.get(crop, 2000)
        
        # Add market-specific variation
        market_variation = random.uniform(-0.05, 0.05)
        current_price = base_price * (1 + market_variation)
        
        # Calculate 24h change
        change_percent = random.uniform(-3, 5)
        change = current_price * (change_percent / 100)
        previous_price = current_price - change
        
        # Calculate 24h high/low
        high_24h = current_price * random.uniform(1.01, 1.03)
        low_24h = current_price * random.uniform(0.97, 0.99)
        
        # Trading volume
        volume = random.randint(5000, 20000)
        
        # MSP
        msp = MSP_PRICES.get(crop, base_price * 0.9)
        
        return jsonify({
            'success': True,
            'priceData': {
                'crop': crop,
                'currentPrice': round(current_price),
                'previousPrice': round(previous_price),
                'change': round(change),
                'changePercent': round(change_percent, 2),
                'isPositive': change >= 0,
                'high24h': round(high_24h),
                'low24h': round(low_24h),
                'volume': volume,
                'msp': msp,
                'unit': 'per quintal',
                'market': MARKETS.get(market, {'name': 'All Markets'})['name'],
                'lastUpdated': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/all-prices', methods=['GET'])
def get_all_prices():
    """Get prices for all crops"""
    try:
        prices = []
        for crop, base_price in BASE_PRICES.items():
            variation = random.uniform(-0.08, 0.08)
            current_price = base_price * (1 + variation)
            change = random.uniform(-5, 7)
            
            prices.append({
                'name': crop.capitalize(),
                'price': round(current_price),
                'change': round(change, 2),
                'isPositive': change >= 0,
                'demand': random.choice(['High', 'Medium', 'Low']),
                'roi': round(random.uniform(10, 35), 1)
            })
        
        return jsonify({
            'success': True,
            'prices': prices,
            'lastUpdated': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/trends', methods=['GET'])
def get_trends():
    """Get demand trends for crops using Gemini AI"""
    try:
        # Default fallback trends
        fallback_trends = [
            {
                'crop': 'Tomato',
                'trend': 'Rising',
                'reason': 'Festival season approaching - increased demand',
                'confidence': 85
            },
            {
                'crop': 'Onion',
                'trend': 'Stable', 
                'reason': 'Good supply from Maharashtra regions',
                'confidence': 78
            },
            {
                'crop': 'Wheat',
                'trend': 'Rising',
                'reason': 'Export demand increasing',
                'confidence': 82
            },
            {
                'crop': 'Cotton',
                'trend': 'Falling',
                'reason': 'International prices dropping',
                'confidence': 70
            },
            {
                'crop': 'Soybean',
                'trend': 'Rising',
                'reason': 'Biodiesel demand surge',
                'confidence': 75
            }
        ]

        from services.gemini_service import gemini_service
        
        # Try to get AI trends
        ai_trends = gemini_service.analyze_market_trends(['Tomato', 'Onion', 'Wheat', 'Cotton', 'Soybean', 'Rice', 'Potato'])
        
        if ai_trends:
            trends = ai_trends
            source = 'AI (Gemini)'
        else:
            trends = fallback_trends
            source = 'Fallback (Simulation)'
        
        return jsonify({
            'success': True,
            'trends': trends,
            'source': source,
            'lastUpdated': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error in /trends: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/price-history', methods=['POST'])
def get_price_history():
    """Get historical price data for a crop"""
    try:
        data = request.json
        crop = data.get('crop', 'wheat').lower()
        days = int(data.get('days', 30))
        
        base_price = BASE_PRICES.get(crop, 2000)
        history = []
        
        current_price = base_price
        for i in range(days, -1, -1):
            date = datetime.now() - timedelta(days=i)
            # Random walk with mean reversion
            change = random.uniform(-50, 50)
            current_price = current_price + change
            # Mean reversion
            current_price = current_price + (base_price - current_price) * 0.05
            
            history.append({
                'date': date.strftime('%Y-%m-%d'),
                'price': round(max(base_price * 0.7, current_price)),
                'volume': random.randint(3000, 15000)
            })
        
        return jsonify({
            'success': True,
            'crop': crop,
            'history': history,
            'period': f'{days} days'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/markets', methods=['GET'])
def get_markets():
    """Get list of available markets"""
    try:
        market_list = [
            {'id': key, **value} for key, value in MARKETS.items()
        ]
        return jsonify({
            'success': True,
            'markets': market_list
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/profit-calculator', methods=['POST'])
def calculate_profit():
    """Calculate profit based on crop, quantity, and costs"""
    try:
        data = request.json
        crop = data.get('crop', 'wheat').lower()
        quantity = float(data.get('quantity', 10))  # in quintals
        production_cost = float(data.get('productionCost', 1500))  # per quintal
        
        current_price = BASE_PRICES.get(crop, 2000) * random.uniform(0.95, 1.05)
        
        total_revenue = quantity * current_price
        total_cost = quantity * production_cost
        profit = total_revenue - total_cost
        profit_margin = (profit / total_revenue * 100) if total_revenue > 0 else 0
        
        return jsonify({
            'success': True,
            'calculation': {
                'crop': crop,
                'quantity': quantity,
                'currentPrice': round(current_price),
                'totalRevenue': round(total_revenue),
                'totalCost': round(total_cost),
                'profit': round(profit),
                'profitMargin': round(profit_margin, 1),
                'isProfitable': profit > 0
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/states', methods=['GET'])
def get_states():
    """Get all states currently in the local DB for Dynamic Insights."""
    try:
        states = MarketService.get_states()
        if not states:
            # If no states, trigger a sync to populate the database initially
            MarketService.sync_market_data(limit=1000)
            states = MarketService.get_states()

        return jsonify({'success': True, 'states': states})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/markets-by-state', methods=['GET'])
def get_markets_by_state():
    """Get markets by state."""
    state = request.args.get('state')
    if not state:
        return jsonify({'success': False, 'error': 'State is required'}), 400
    try:
        markets = MarketService.get_markets(state)
        return jsonify({'success': True, 'markets': markets})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/crops', methods=['GET'])
def get_crops():
    """Get crops by market."""
    market = request.args.get('market')
    if not market:
        return jsonify({'success': False, 'error': 'Market is required'}), 400
    try:
        crops = MarketService.get_crops(market)
        return jsonify({'success': True, 'crops': crops})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/market-insights', methods=['GET'])
def get_market_insights():
    """Get insight details using state, market, and crop."""
    state = request.args.get('state')
    market = request.args.get('market')
    crop = request.args.get('crop')

    if not all([state, market, crop]):
        return jsonify({'success': False, 'error': 'State, market and crop are required params'}), 400

    try:
        data = MarketService.get_market_insights(state, market, crop)
        if data:
            return jsonify({'success': True, 'data': data})
        else:
            return jsonify({'success': False, 'error': 'No data found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

