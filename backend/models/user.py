from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='farmer')
    
    # Personal Information (stored as JSON text)
    personal_info = db.Column(db.Text, default='{}')
    
    # Recent Searches (stored as JSON text)
    recent_searches = db.Column(db.Text, default='[]')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, email, password, name, role='farmer', personal_info=None):
        self.email = email
        self.password = generate_password_hash(password).decode('utf-8')
        self.name = name
        self.role = role
        self.personal_info = json.dumps(personal_info or {})
        self.recent_searches = json.dumps([])
    
    @staticmethod
    def create_user(email, password, name, role='farmer', personal_info=None):
        """Creates a new user if email doesn't exist."""
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return None, "User with this email already exists"
        
        try:
            new_user = User(email=email, password=password, name=name, role=role, personal_info=personal_info)
            db.session.add(new_user)
            db.session.commit()
            return str(new_user.id), None
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def find_by_email(email):
        """Finds a user by email."""
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def find_by_id(user_id):
        """Finds a user by ID."""
        try:
            return User.query.get(int(user_id))
        except:
            return None
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        """Verifies the password."""
        return check_password_hash(stored_password, provided_password)
    
    def update_personal_info(self, personal_info):
        """Updates user's personal information."""
        try:
            self.personal_info = json.dumps(personal_info)
            self.updated_at = datetime.utcnow()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    def add_recent_search(self, search_data):
        """Adds a recent search, maintains max 10 searches."""
        try:
            # Parse existing searches
            searches = json.loads(self.recent_searches) if self.recent_searches else []
            
            # Add timestamp to search data
            search_entry = {
                **search_data,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            # Insert at beginning and keep only last 10
            searches.insert(0, search_entry)
            searches = searches[:10]
            
            # Save back
            self.recent_searches = json.dumps(searches)
            self.updated_at = datetime.utcnow()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    def get_recent_searches(self):
        """Gets user's recent searches."""
        try:
            return json.loads(self.recent_searches) if self.recent_searches else []
        except:
            return []
    
    def clear_recent_searches(self):
        """Clears all recent searches for a user."""
        try:
            self.recent_searches = json.dumps([])
            self.updated_at = datetime.utcnow()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    def to_json(self):
        """Converts user object to JSON-safe dictionary (removes password)."""
        try:
            personal_info_dict = json.loads(self.personal_info) if self.personal_info else {}
        except:
            personal_info_dict = {}
        
        try:
            recent_searches_list = json.loads(self.recent_searches) if self.recent_searches else []
        except:
            recent_searches_list = []
        
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'personal_info': personal_info_dict,
            'recent_searches': recent_searches_list,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class UserModel:
    """Compatibility wrapper to work with existing routes"""
    
    def __init__(self, db_instance):
        global db
        db = db_instance
    
    def create_user(self, email, password, name, role='farmer', personal_info=None):
        return User.create_user(email, password, name, role, personal_info)
    
    def find_by_email(self, email):
        return User.find_by_email(email)
    
    def find_by_id(self, user_id):
        return User.find_by_id(user_id)
    
    def verify_password(self, stored_password, provided_password):
        return User.verify_password(stored_password, provided_password)
    
    def update_personal_info(self, user_id, personal_info):
        user = User.find_by_id(user_id)
        if user:
            return user.update_personal_info(personal_info)
        return False
    
    def add_recent_search(self, user_id, search_data):
        user = User.find_by_id(user_id)
        if user:
            return user.add_recent_search(search_data)
        return False
    
    def get_recent_searches(self, user_id):
        user = User.find_by_id(user_id)
        if user:
            return user.get_recent_searches()
        return []
    
    def clear_recent_searches(self, user_id):
        user = User.find_by_id(user_id)
        if user:
            return user.clear_recent_searches()
        return False
    
    @staticmethod
    def to_json(user):
        """Static method for compatibility"""
        if user and hasattr(user, 'to_json'):
            return user.to_json()
        return None
