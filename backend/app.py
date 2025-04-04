from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS  
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS globally

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["diagno_ai"]

# Import and register routes
from routes.auth import auth_bp

app.register_blueprint(auth_bp, url_prefix="/auth")

if __name__ == "__main__":
    app.run(debug=True)
