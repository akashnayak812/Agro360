import requests
from datetime import datetime

API_KEY = "579b464db66ec23bdd000001c7e1e45ebbd846ca6ab16ff56074f14e"
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

class MarketService:
    @staticmethod
    def sync_market_data(limit=500, state=None, market=None, commodity=None):
        """Fetches data from AGMARKNET API and updates the local database."""
        from models.market_price import MarketPrice
        from extensions import db
        try:
            url = f"{BASE_URL}?api-key={API_KEY}&format=json&limit={limit}"
            
            # Use correct API filter field names (state.keyword for state)
            if state:
                url += f"&filters[state.keyword]={requests.utils.quote(state)}"
            if market:
                url += f"&filters[market]={requests.utils.quote(market)}"
            if commodity:
                url += f"&filters[commodity]={requests.utils.quote(commodity)}"

            print(f"[MarketService] Fetching from Agmarknet: limit={limit}, state={state}, market={market}, commodity={commodity}")
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                data = response.json()
                records = data.get('records', [])
                print(f"[MarketService] Got {len(records)} records from API (total available: {data.get('total', '?')})")
                
                for record in records:
                    existing = MarketPrice.query.filter_by(
                        state=record.get('state'),
                        market=record.get('market'),
                        commodity=record.get('commodity'),
                        arrival_date=record.get('arrival_date')
                    ).first()
                    
                    if existing:
                        existing.min_price = float(record.get('min_price', 0) or 0)
                        existing.max_price = float(record.get('max_price', 0) or 0)
                        existing.modal_price = float(record.get('modal_price', 0) or 0)
                    else:
                        new_price = MarketPrice(
                            state=record.get('state'),
                            district=record.get('district'),
                            market=record.get('market'),
                            commodity=record.get('commodity'),
                            min_price=float(record.get('min_price', 0) or 0),
                            max_price=float(record.get('max_price', 0) or 0),
                            modal_price=float(record.get('modal_price', 0) or 0),
                            arrival_date=record.get('arrival_date')
                        )
                        db.session.add(new_price)
                
                db.session.commit()
                return len(records)
            else:
                print(f"[MarketService] Error fetching data: HTTP {response.status_code}")
                return 0
        except Exception as e:
            db.session.rollback()
            print(f"[MarketService] Exception in sync_market_data: {e}")
            return 0

    @staticmethod
    def _fetch_live_direct(state=None, market=None, commodity=None, limit=20):
        """Fetch data directly from the Agmarknet API without touching DB.
        Returns a list of raw record dicts."""
        try:
            url = f"{BASE_URL}?api-key={API_KEY}&format=json&limit={limit}"
            if state:
                url += f"&filters[state.keyword]={requests.utils.quote(state)}"
            if market:
                url += f"&filters[market]={requests.utils.quote(market)}"
            if commodity:
                url += f"&filters[commodity]={requests.utils.quote(commodity)}"
            
            response = requests.get(url, timeout=15)
            if response.status_code == 200:
                data = response.json()
                return data.get('records', [])
        except Exception as e:
            print(f"[MarketService] Live direct fetch failed: {e}")
        return []

    @staticmethod
    def get_states():
        """Get all distinct states by querying the database."""
        from models.market_price import MarketPrice
        from extensions import db
        states = db.session.query(MarketPrice.state).distinct().all()
        return [state[0] for state in states if state[0]]

    @staticmethod
    def get_markets(state):
        """Get all distinct markets for a given state."""
        from models.market_price import MarketPrice
        from extensions import db
        
        markets = db.session.query(MarketPrice.market).filter(MarketPrice.state == state).distinct().all()
        market_list = [market[0] for market in markets if market[0]]
        
        # If we have very few markets, try to sync more data for this state
        if len(market_list) < 3:
            print(f"[MarketService] Few markets for {state}, syncing more data...")
            MarketService.sync_market_data(limit=500, state=state)
            markets = db.session.query(MarketPrice.market).filter(MarketPrice.state == state).distinct().all()
            market_list = [market[0] for market in markets if market[0]]
        
        return market_list

    @staticmethod
    def get_crops(market):
        """Get all distinct commodities for a given market."""
        from models.market_price import MarketPrice
        from extensions import db
        crops = db.session.query(MarketPrice.commodity).filter(MarketPrice.market == market).distinct().all()
        return [crop[0] for crop in crops if crop[0]]

    @staticmethod
    def get_market_insights(state, market, commodity):
        """Get the latest price details for a specific state, market, and crop.
        First checks DB, then tries a targeted API sync, then falls back to
        direct live fetch for an immediate response."""
        from models.market_price import MarketPrice
        from extensions import db
        
        # 1. Check DB first
        result = MarketPrice.query.filter_by(
            state=state, market=market, commodity=commodity
        ).order_by(MarketPrice.id.desc()).first()
        
        if not result:
            # 2. Try targeted sync from API into DB
            synced = MarketService.sync_market_data(limit=50, state=state, market=market, commodity=commodity)
            if synced > 0:
                result = MarketPrice.query.filter_by(
                    state=state, market=market, commodity=commodity
                ).order_by(MarketPrice.id.desc()).first()
        
        if not result:
            # 3. Try broader sync (just state + commodity, no market filter)
            synced = MarketService.sync_market_data(limit=100, state=state, commodity=commodity)
            if synced > 0:
                result = MarketPrice.query.filter_by(
                    state=state, market=market, commodity=commodity
                ).order_by(MarketPrice.id.desc()).first()
        
        if not result:
            # 4. Last resort: direct live fetch and return without DB
            records = MarketService._fetch_live_direct(state=state, commodity=commodity, limit=50)
            if records:
                # Try to find exact market match
                for r in records:
                    if r.get('market', '').lower() == market.lower():
                        return {
                            "state": r.get('state'),
                            "district": r.get('district'),
                            "market": r.get('market'),
                            "commodity": r.get('commodity'),
                            "min_price": float(r.get('min_price', 0) or 0),
                            "max_price": float(r.get('max_price', 0) or 0),
                            "modal_price": float(r.get('modal_price', 0) or 0),
                            "arrival_date": r.get('arrival_date'),
                            "trend": "stable",
                            "source": "live_api"
                        }
                # If no exact market match, return the first record for that state+commodity 
                # with a note about the market
                r = records[0]
                return {
                    "state": r.get('state'),
                    "district": r.get('district'),
                    "market": r.get('market'),
                    "commodity": r.get('commodity'),
                    "min_price": float(r.get('min_price', 0) or 0),
                    "max_price": float(r.get('max_price', 0) or 0),
                    "modal_price": float(r.get('modal_price', 0) or 0),
                    "arrival_date": r.get('arrival_date'),
                    "trend": "stable",
                    "source": "live_api",
                    "note": f"Showing nearest available data from {r.get('market')} market"
                }

        if result:
            # Calculate trend based on previous dates if available
            previous = MarketPrice.query.filter_by(
                state=state, market=market, commodity=commodity
            ).order_by(MarketPrice.id.desc()).all()
            
            trend = "stable"
            if len(previous) > 1:
                if result.modal_price > previous[1].modal_price:
                    trend = "increasing"
                elif result.modal_price < previous[1].modal_price:
                    trend = "decreasing"
                    
            data = result.to_dict()
            data['trend'] = trend
            data['source'] = 'database'
            return data
            
        return None
