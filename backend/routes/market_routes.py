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
    """Get current market prices for a crop — fetches live data from AGMARKNET."""
    try:
        data = request.json
        crop = data.get('crop', 'wheat').lower()
        market = data.get('market', 'all')
        
        # Try fetching live data from AGMARKNET
        live_records = MarketService._fetch_live_direct(commodity=crop.capitalize(), limit=20)
        
        if live_records:
            # Pick the most relevant record (exact market match or first)
            record = live_records[0]
            for r in live_records:
                if market != 'all' and r.get('market', '').lower() == market.lower():
                    record = r
                    break
            
            current_price = float(record.get('modal_price', 0) or 0)
            min_price = float(record.get('min_price', 0) or 0)
            max_price = float(record.get('max_price', 0) or 0)
            
            # Calculate change by comparing with a second record if available
            change = 0
            change_percent = 0
            if len(live_records) > 1:
                prev_price = float(live_records[1].get('modal_price', 0) or 0)
                if prev_price > 0:
                    change = current_price - prev_price
                    change_percent = round((change / prev_price) * 100, 2)
            
            msp = MSP_PRICES.get(crop, current_price * 0.9)
            
            return jsonify({
                'success': True,
                'priceData': {
                    'crop': crop,
                    'currentPrice': round(current_price),
                    'previousPrice': round(current_price - change),
                    'change': round(change),
                    'changePercent': change_percent,
                    'isPositive': change >= 0,
                    'high24h': round(max_price),
                    'low24h': round(min_price),
                    'volume': '-',
                    'msp': msp,
                    'unit': 'per quintal',
                    'market': record.get('market', 'AGMARKNET'),
                    'arrival_date': record.get('arrival_date', ''),
                    'lastUpdated': datetime.now().isoformat(),
                    'source': 'AGMARKNET (Live)'
                }
            })
        
        # Fallback: use base prices if API is unreachable
        base_price = BASE_PRICES.get(crop, 2000)
        msp = MSP_PRICES.get(crop, base_price * 0.9)
        
        return jsonify({
            'success': True,
            'priceData': {
                'crop': crop,
                'currentPrice': round(base_price),
                'previousPrice': round(base_price),
                'change': 0,
                'changePercent': 0,
                'isPositive': True,
                'high24h': round(base_price * 1.02),
                'low24h': round(base_price * 0.98),
                'volume': '-',
                'msp': msp,
                'unit': 'per quintal',
                'market': MARKETS.get(market, {'name': 'All Markets'})['name'],
                'lastUpdated': datetime.now().isoformat(),
                'source': 'Base Reference (Offline)'
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@market_bp.route('/all-prices', methods=['GET'])
def get_all_prices():
    """Get prices for all crops — fetches live data from AGMARKNET."""
    try:
        # Fetch a broad batch from AGMARKNET (latest available)
        live_records = MarketService._fetch_live_direct(limit=500)
        
        # Index live records by commodity (lowercase)
        live_index = {}
        for r in live_records:
            commodity = (r.get('commodity') or '').lower()
            if commodity and commodity not in live_index:
                live_index[commodity] = r
        
        prices = []
        for crop, base_price in BASE_PRICES.items():
            live = live_index.get(crop)
            if live:
                current_price = float(live.get('modal_price', 0) or 0)
                min_p = float(live.get('min_price', 0) or 0)
                max_p = float(live.get('max_price', 0) or 0)
                change = round(((current_price - base_price) / base_price) * 100, 2) if base_price else 0
                source = 'AGMARKNET'
            else:
                current_price = base_price
                change = 0
                source = 'Reference'
            
            prices.append({
                'name': crop.capitalize(),
                'price': round(current_price),
                'change': change,
                'isPositive': change >= 0,
                'demand': 'High' if change > 3 else ('Low' if change < -3 else 'Medium'),
                'roi': round(max(5, min(40, 15 + change)), 1),
                'source': source
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

