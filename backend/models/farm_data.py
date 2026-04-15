from datetime import datetime
from extensions import db

class UserFarmData(db.Model):
    __tablename__ = 'user_farm_data'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.String(255), nullable=False, index=True) # Maps to Firebase UID
    activeCrops = db.Column(db.Integer, default=0)
    monthlyIncome = db.Column(db.Float, default=0.0)
    landArea = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, userId, activeCrops=0, monthlyIncome=0.0, landArea=0.0):
        self.userId = userId
        self.activeCrops = activeCrops
        self.monthlyIncome = monthlyIncome
        self.landArea = landArea
    
    @staticmethod
    def get_by_user_id(user_id):
        return UserFarmData.query.filter_by(userId=user_id).first()
    
    def to_json(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'activeCrops': self.activeCrops,
            'monthlyIncome': self.monthlyIncome,
            'landArea': self.landArea,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
