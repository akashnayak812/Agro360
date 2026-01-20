from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from config import Config

# Load environment variables from .env file
load_dotenv()

from routes.crop_routes import crop_bp
from routes.fertilizer_routes import fertilizer_bp
from routes.yield_routes import yield_bp
from routes.soil_routes import soil_bp
from routes.disease_routes import disease_bp
from routes.advisory_routes import advisory_bp
from routes.community_routes import community_bp
from routes.voice_routes import voice_bp
from routes.auth_routes import auth_bp, init_auth_routes
from routes.chatbot_routes import chatbot_bp
from routes.soil_image_routes import soil_image_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

# MySQL Connection
try:
    # Test database connection
    with app.app_context():
        db.create_all()
    print(f"Connected to MySQL at {app.config['MYSQL_HOST']}")
    
    # Initialize Auth Routes with DB
    init_auth_routes(db)
except Exception as e:
    print(f"Error connecting to MySQL: {e}")
    # We continue so that other routes might not fail immediately, 
    # but auth won't work without DB.

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(crop_bp, url_prefix='/api/crop')
app.register_blueprint(fertilizer_bp, url_prefix='/api/fertilizer')
app.register_blueprint(yield_bp, url_prefix='/api/yield')
app.register_blueprint(soil_bp, url_prefix='/api/soil')
app.register_blueprint(disease_bp, url_prefix='/api/disease')
app.register_blueprint(advisory_bp, url_prefix='/api/advisory')
app.register_blueprint(community_bp, url_prefix='/api/community')
app.register_blueprint(voice_bp, url_prefix='/api/voice')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
app.register_blueprint(soil_image_bp, url_prefix='/api/soil')

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Agro360 API"})

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
