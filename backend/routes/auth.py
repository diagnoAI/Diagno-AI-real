from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required
from flask_cors import CORS
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
import datetime
import random
from utils.email import send_otp_email

# Load environment variables
load_dotenv()

# Blueprint setup
auth_bp = Blueprint("auth", __name__)
CORS(auth_bp)  

# Initialize bcrypt
bcrypt = Bcrypt()

# MongoDB connection
def get_db():
    client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    return client["diagno_ai"]

db = get_db()
doctors = db["doctors"]
otp_collection = db["otp_verifications"]



@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Signup and send OTP"""
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    if not all([name, email, password, confirm_password]):
        return jsonify({"message": "All fields are required"}), 400
    if password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400
    if doctors.find_one({"email": email}):
        return jsonify({"message": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    doctor = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "isVerified": False,
        "hospital": "",
        "profileImage": "",
        "createdAt": datetime.datetime.utcnow(),
        "updatedAt": datetime.datetime.utcnow()
    }
    doctor_id = doctors.insert_one(doctor).inserted_id

    # Generate and send OTP
    otp = str(random.randint(100000, 999999))
    print(f"Generated OTP: {otp}")
    
    # Store OTP in database with expiration
    otp_collection.insert_one({
        "email": email,
        "otp": otp,
        "createdAt": datetime.datetime.utcnow(),
        "expiresAt": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    })
    
    send_otp_email(email, otp)

    return jsonify({"message": "Signup successful, OTP sent to email", "doctorId": str(doctor_id)}), 201


@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    """Verify OTP"""
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    otp_record = otp_collection.find_one({"email": email, "otp": otp})
    if not otp_record or otp_record["expiresAt"] < datetime.datetime.utcnow():
        return jsonify({"message": "Invalid or expired OTP"}), 400

    doctors.update_one({"email": email}, {"$set": {"isVerified": True}})
    otp_collection.delete_one({"email": email, "otp": otp})

    return jsonify({"message": "OTP verified successfully"}), 200


@auth_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    """Resend OTP if expired or not received"""
    data = request.json
    email = data.get("email")

    doctor = doctors.find_one({"email": email})
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404
    if doctor["isVerified"]:
        return jsonify({"message": "Email is already verified"}), 400

    # Generate a new OTP
    new_otp = str(random.randint(100000, 999999))
    print(f"Resent OTP: {new_otp}")

    # Update or insert OTP in database
    otp_collection.update_one(
        {"email": email},
        {
            "$set": {
                "otp": new_otp,
                "createdAt": datetime.datetime.utcnow(),
                "expiresAt": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
            }
        },
        upsert=True
    )

    send_otp_email(email, new_otp)

    return jsonify({"message": "New OTP sent to email"}), 200


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login"""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    doctor = doctors.find_one({"email": email})
    if not doctor or not bcrypt.check_password_hash(doctor["password"], password):
        return jsonify({"message": "Invalid email or password"}), 401
    if not doctor["isVerified"]:
        return jsonify({"message": "Please verify your email first"}), 403

    access_token = create_access_token(identity=str(doctor["_id"]))
    return jsonify({
        "message": "Login successful",
        "accessToken": access_token,
        "doctor": {
            "id": str(doctor["_id"]),
            "name": doctor["name"],
            "email": doctor["email"],
            "hospital": doctor["hospital"],
            "profileImage": doctor["profileImage"]
        }
    }), 200

@auth_bp.route("/setup1", methods=["POST"])
def setup1():
    """Setup step 1"""
    data = request.json
    fullname = data.get("fullname")
    dob = data.get("dob")
    gender = data.get("gender")

    if not all([fullname,dob,gender]):
        return jsonify({"message": "All fields are required"}), 400
    
    doctor_setup1 = {
        "fullname": fullname,
        "date-of-birth": dob,
        "gender" :gender
    }

    doctor_id = doctors.insert_one(doctor_setup1).inserted_id
    print(doctor_id)

    return jsonify({"message": "Setup step 1 completed successfully"}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Logout"""
    return jsonify({"message": "Logout successful"}), 200
