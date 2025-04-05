from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
import datetime
import random
from bson.objectid import ObjectId
from utils.email import send_otp_email
import base64
from utils.compress import compress_image

# Load environment variables
load_dotenv()

# Blueprint setup
auth_bp = Blueprint("auth", __name__)
CORS(auth_bp, resources={r"/auth/*": {"origins": "http://localhost:5173"}})

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
    full_name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    if not all([full_name, email, password, confirm_password]):
        return jsonify({"message": "All fields are required"}), 400
    if password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400
    if doctors.find_one({"email": email}):
        return jsonify({"message": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    doctor = {
        "fullName": full_name,
        "email": email,
        "password": hashed_password,
        "dob": None,
        "gender": "",
        "age": 0,  # New field
        "hospitalName": "",
        "specialization": "",
        "licenseNumber": "",
        "yearsOfExperience": 0,
        "profilePhoto": "",  # Store as base64 string
        "phone": "",  # New field
        "bio": "",  # New field
        "isVerified": False,
        "profileSetupCompleted": False,
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
    """Verify OTP and issue JWT token"""
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    otp_record = otp_collection.find_one({"email": email, "otp": otp})
    if not otp_record or otp_record["expiresAt"] < datetime.datetime.utcnow():
        return jsonify({"message": "Invalid or expired OTP"}), 400

    doctor = doctors.find_one({"email": email})
    doctors.update_one({"email": email}, {"$set": {"isVerified": True}})
    otp_collection.delete_one({"email": email, "otp": otp})

    access_token = create_access_token(identity=str(doctor["_id"]))
    return jsonify({
        "message": "OTP verified successfully",
        "accessToken": access_token,
        "doctorId": str(doctor["_id"])
    }), 200

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
        return jsonify({"message": "Please verify your email first", "doctorId": str(doctor["_id"])}), 403
    if not doctor["profileSetupCompleted"]:
        return jsonify({"message": "Please complete your profile setup", "doctorId": str(doctor["_id"])}), 403

    access_token = create_access_token(identity=str(doctor["_id"]))
    return jsonify({
        "message": "Login successful",
        "accessToken": access_token,
        "doctor": {
            "id": str(doctor["_id"]),
            "fullName": doctor["fullName"],
            "email": doctor["email"],
            "hospitalName": doctor["hospitalName"],
            "profilePhoto": doctor["profilePhoto"],  # Base64 string
            "dob": doctor["dob"].isoformat() if doctor["dob"] else None,
            "gender": doctor["gender"],
            "age": doctor["age"],  # New field
            "specialization": doctor["specialization"],
            "licenseNumber": doctor["licenseNumber"],
            "yearsOfExperience": doctor["yearsOfExperience"],
            "phone": doctor["phone"],  # New field
            "bio": doctor["bio"]  # New field
        }
    }), 200

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """Fetch doctor profile"""
    doctor_id = get_jwt_identity()
    doctor = doctors.find_one({"_id": ObjectId(doctor_id)})
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    return jsonify({
        "doctor": {
            "id": str(doctor["_id"]),
            "fullName": doctor["fullName"],
            "email": doctor["email"],
            "hospitalName": doctor["hospitalName"],
            "profilePhoto": doctor["profilePhoto"],  # Base64 string
            "dob": doctor["dob"].isoformat() if doctor["dob"] else None,
            "gender": doctor["gender"],
            "age": doctor["age"],  # New field
            "specialization": doctor["specialization"],
            "licenseNumber": doctor["licenseNumber"],
            "yearsOfExperience": doctor["yearsOfExperience"],
            "phone": doctor["phone"],  # New field
            "bio": doctor["bio"]  # New field
        }
    }), 200

@auth_bp.route("/setup-profile", methods=["POST"])
@jwt_required()
def setup_profile():
    """Update doctor profile based on step"""
    doctor_id = get_jwt_identity()
    data = request.form if request.form else request.json
    step = data.get("step")

    if not step:
        return jsonify({"message": "Step is required"}), 400

    updates = {"updatedAt": datetime.datetime.utcnow()}
    doctor = doctors.find_one({"_id": ObjectId(doctor_id)})
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    if step == "1":
        full_name = data.get("fullName")
        dob = data.get("dob")
        gender = data.get("gender")  # New field

        if not all([full_name, dob, gender]):
            return jsonify({"message": "All fields are required for step 1"}), 400

        updates["fullName"] = full_name
        updates["dob"] = datetime.datetime.strptime(dob, "%Y-%m-%d")
        updates["gender"] = gender # New field

    elif step == "2":
        hospital_name = data.get("hospitalName")
        specialization = data.get("specialization")
        license_number = data.get("licenseNumber")
        years_of_experience = data.get("yearsOfExperience")

        if not all([hospital_name, specialization, license_number, years_of_experience]):
            return jsonify({"message": "All fields are required for step 2"}), 400

        updates["hospitalName"] = hospital_name
        updates["specialization"] = specialization
        updates["licenseNumber"] = license_number
        updates["yearsOfExperience"] = int(years_of_experience)

    elif step == "3":
        profile_photo = request.files.get("profilePhoto") if "profilePhoto" in request.files else None
        if profile_photo:
            # Read the image file
            image_data = profile_photo.read()
            image_size_mb = len(image_data) / (1024 * 1024)

            # Compress the image if it's larger than 1MB
            if image_size_mb > 1:
                print(f"Compressing image: Original size = {image_size_mb:.2f} MB")
                try:
                    image_data = compress_image(image_data, max_size_mb=1, max_dimension=300, quality=85)
                except ValueError as e:
                    return jsonify({"message": str(e)}), 400
                compressed_size_mb = len(image_data) / (1024 * 1024)
                print(f"Compressed size = {compressed_size_mb:.2f} MB")

            # Convert the (possibly compressed) image to base64
            base64_image = base64.b64encode(image_data).decode("utf-8")
            mime_type = profile_photo.mimetype
            base64_image = f"data:{mime_type};base64,{base64_image}"
            updates["profilePhoto"] = base64_image
            updates["profileSetupCompleted"] = True
        else:
            updates["profilePhoto"] = doctor.get("profilePhoto", "")
            updates["profileSetupCompleted"] = True

    elif step == "update":  # New step for profile editing
        full_name = data.get("fullName")
        hospital_name = data.get("hospitalName")
        specialization = data.get("specialization")
        years_of_experience = data.get("yearsOfExperience")
        phone = data.get("phone")
        bio = data.get("bio")
        age = data.get("age")  # New field
        gender = data.get("gender")  # New field

        if not all([full_name, hospital_name, specialization, years_of_experience, phone, bio, age, gender]):
            return jsonify({"message": "All fields are required for profile update"}), 400

        updates["fullName"] = full_name
        updates["hospitalName"] = hospital_name
        updates["specialization"] = specialization
        updates["yearsOfExperience"] = int(years_of_experience)
        updates["phone"] = phone
        updates["bio"] = bio
        updates["age"] = int(age)  # New field
        updates["gender"] = gender  # New field

    else:
        return jsonify({"message": "Invalid step"}), 400

    doctors.update_one({"_id": ObjectId(doctor_id)}, {"$set": updates})
    updated_doctor = doctors.find_one({"_id": ObjectId(doctor_id)})

    return jsonify({
        "message": f"Profile {step} completed successfully",
        "profileSetupCompleted": updated_doctor["profileSetupCompleted"],
        "doctor": {
            "id": str(updated_doctor["_id"]),
            "fullName": updated_doctor["fullName"],
            "email": updated_doctor["email"],
            "dob": updated_doctor["dob"].isoformat() if updated_doctor["dob"] else None,
            "gender": updated_doctor["gender"],
            "age": updated_doctor["age"],  # New field
            "hospitalName": updated_doctor["hospitalName"],
            "specialization": updated_doctor["specialization"],
            "licenseNumber": updated_doctor["licenseNumber"],
            "yearsOfExperience": updated_doctor["yearsOfExperience"],
            "profilePhoto": updated_doctor["profilePhoto"],
            "phone": updated_doctor["phone"],  # New field
            "bio": updated_doctor["bio"]  # New field
        }
    }), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Logout"""
    return jsonify({"message": "Logout successful"}), 200