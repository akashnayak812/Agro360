from extensions import db
from datetime import datetime

class MarketPrice(db.Model):
    __tablename__ = 'market_prices'

    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    market = db.Column(db.String(100), nullable=False)
    commodity = db.Column(db.String(100), nullable=False)
    min_price = db.Column(db.Float, nullable=True)
    max_price = db.Column(db.Float, nullable=True)
    modal_price = db.Column(db.Float, nullable=True)
    arrival_date = db.Column(db.String(50), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "state": self.state,
            "district": self.district,
            "market": self.market,
            "commodity": self.commodity,
            "min_price": self.min_price,
            "max_price": self.max_price,
            "modal_price": self.modal_price,
            "arrival_date": self.arrival_date,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
