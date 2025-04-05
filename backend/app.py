from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Enable CORS for the frontend origin
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["diagno_ai"]

# Import and register routes
from routes.auth import auth_bp
from routes.patient import patient_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(patient_bp, url_prefix="/patient")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)