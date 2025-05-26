from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
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

# MongoDB connection
def get_db():
    client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    return client["diagno_ai"]

db = get_db()
doctors = db["doctors"]
otp_collection = db["otp_verifications"]
password_reset = db["password_reset"]

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    fullname = data.get("name")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")
    print(data)

    if not all([fullname, email, password, confirm_password]):
        return jsonify({"message": "All fields are required"}), 400
    if password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400
    
    existing_doctor = doctors.find_one({"email": email})

    if existing_doctor and not existing_doctor["isVerified"]:
        otp_record = otp_collection.find_one({"email": email})

        if otp_record and otp_record["expiresAt"] < datetime.datetime.utcnow():
            otp_collection.delete_one({"email": email})
            doctors.delete_one({"email": email})
            print(f"Deleted expired OTP for {email}")
        else:
            return jsonify({"message": "Email already exists, please verify your email"}), 400
        
    
    elif existing_doctor:
        return jsonify({"message": "Email already exists"}), 400


    hashed_password = generate_password_hash(password)
    doctor = {
        "fullName": fullname,
        "email": email,
        "password": hashed_password,
        "dob": None,
        "gender": "",
        "age": 0,
        "hospitalName": "",
        "specialization": "",
        "licenseNumber": "",
        "yearsOfExperience": 0,
        "profilePhoto": "",
        "phone": "",
        "bio": "",
        "isVerified": False,
        "profileSetupCompleted": False,
        "createdAt": datetime.datetime.utcnow(),
        "updatedAt": datetime.datetime.utcnow()
    }
    doctor_id = doctors.insert_one(doctor).inserted_id

    otp = str(random.randint(100000, 999999))
    print(f"Generated OTP: {otp}")

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
    data = request.json
    email = data.get("email")

    doctor = doctors.find_one({"email": email})
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404
    if doctor["isVerified"]:
        return jsonify({"message": "Email is already verified"}), 400

    new_otp = str(random.randint(100000, 999999))
    print(f"Resent OTP: {new_otp}")

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

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get("email")
    print(f"Forgot password request for: {email}")

    if not email:
        return jsonify({"message": "Email is required"}), 400

    doctor = doctors.find_one({"email": email})
    if not doctor:
        return jsonify({"message": "Email not found"}), 404

    otp = str(random.randint(100000, 999999))
    print(f"Generated reset OTP: {otp}")

    password_reset.insert_one({
        "email": email,
        "otp": otp,
        "createdAt": datetime.datetime.utcnow(),
        "expiresAt": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    })

    send_otp_email(email, otp, is_reset=True)

    return jsonify({"message": "Reset OTP sent to email"}), 200

@auth_bp.route("/verify-reset-code", methods=["POST"])
def verify_reset_code():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    if not all([email, otp]):
        return jsonify({"message": "Email and OTP are required"}), 400

    reset_record = password_reset.find_one({"email": email, "otp": otp})
    if not reset_record or reset_record["expiresAt"] < datetime.datetime.utcnow():
        return jsonify({"message": "Invalid or expired OTP"}), 400

    doctor = doctors.find_one({"email": email})
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    # Generate a short-lived JWT token for password reset
    access_token = create_access_token(identity=str(doctor["_id"]), expires_delta=datetime.timedelta(minutes=15))
    password_reset.delete_one({"email": email, "otp": otp})

    return jsonify({
        "message": "Reset OTP verified successfully",
        "resetToken": access_token
    }), 200

@auth_bp.route("/reset-password", methods=["POST"])
@jwt_required()
def reset_password():
    data = request.json
    doctor_id = get_jwt_identity()
    new_password = data.get("newPassword")
    confirm_password = data.get("confirmPassword")
    print(f"Reset password request for doctor_id: {doctor_id}")

    if not all([new_password, confirm_password]):
        return jsonify({"message": "All fields are required"}), 400
    if new_password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400
    if len(new_password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    doctor = doctors.find_one({"_id": ObjectId(doctor_id)})
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    hashed_new_password = generate_password_hash(new_password)
    doctors.update_one({"_id": ObjectId(doctor_id)}, {"$set": {"password": hashed_new_password}})

    return jsonify({"message": "Password reset successfully"}), 200

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    doctor = doctors.find_one({"email": email})
    if not doctor or not check_password_hash(doctor["password"], password):
        return jsonify({"message": "Invalid email or password"}), 401
    if not doctor["isVerified"]:
        return jsonify({"message": "Please verify your email first", "doctorId": str(doctor["_id"])}), 403

    access_token = create_access_token(identity=str(doctor["_id"]))
    return jsonify({
        "message": "Login successful",
        "accessToken": access_token,
        "doctor": {
            "id": str(doctor["_id"]),
            "fullName": doctor["fullName"],
            "email": doctor["email"],
            "hospitalName": doctor["hospitalName"],
            "profilePhoto": doctor["profilePhoto"],
            "dob": doctor["dob"].isoformat() if doctor["dob"] else None,
            "gender": doctor["gender"],
            "age": doctor["age"],
            "specialization": doctor["specialization"],
            "licenseNumber": doctor["licenseNumber"],
            "yearsOfExperience": doctor["yearsOfExperience"],
            "phone": doctor["phone"],
            "bio": doctor["bio"]
        }
    }), 200

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
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
            "profilePhoto": doctor["profilePhoto"],
            "dob": doctor["dob"].isoformat() if doctor["dob"] else None,
            "gender": doctor["gender"],
            "age": doctor["age"],
            "specialization": doctor["specialization"],
            "licenseNumber": doctor["licenseNumber"],
            "yearsOfExperience": doctor["yearsOfExperience"],
            "phone": doctor["phone"],
            "bio": doctor["bio"]
        }
    }), 200

@auth_bp.route("/setup-profile", methods=["POST"])
@jwt_required()
def setup_profile():
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
        gender = data.get("gender")

        if not all([full_name, dob, gender]):
            return jsonify({"message": "All fields are required for step 1"}), 400

        updates["fullName"] = full_name
        updates["dob"] = datetime.datetime.strptime(dob, "%Y-%m-%d")
        updates["gender"] = gender

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
        if not profile_photo:
            return jsonify({"message": "Profile photo is required"}), 400

        image_data = profile_photo.read()
        image_size_mb = len(image_data) / (1024 * 1024)

        if image_size_mb > 5:
            return jsonify({"message": "Image size exceeds 5MB limit"}), 400

        if image_size_mb > 1:
            print(f"Compressing image: Original size = {image_size_mb:.2f} MB")
            try:
                image_data = compress_image(image_data, max_size_mb=1, max_dimension=300, quality=85)
            except ValueError as e:
                return jsonify({"message": str(e)}), 400
            compressed_size_mb = len(image_data) / (1024 * 1024)
            print(f"Compressed size = {compressed_size_mb:.2f} MB")

        base64_image = base64.b64encode(image_data).decode("utf-8")
        mime_type = profile_photo.mimetype
        base64_image = f"data:{mime_type};base64,{base64_image}"
        updates["profilePhoto"] = base64_image
        updates["profileSetupCompleted"] = True

    elif step == "update":
        full_name = data.get("fullName")
        hospital_name = data.get("hospitalName")
        specialization = data.get("specialization")
        years_of_experience = data.get("yearsOfExperience")
        phone = data.get("phone")
        bio = data.get("bio")
        age = data.get("age")
        gender = data.get("gender")

        if not all([full_name, hospital_name, specialization, years_of_experience, phone, bio, age, gender]):
            return jsonify({"message": "All fields are required for profile update"}), 400

        updates["fullName"] = full_name
        updates["hospitalName"] = hospital_name
        updates["specialization"] = specialization
        updates["yearsOfExperience"] = int(years_of_experience)
        updates["phone"] = phone
        updates["bio"] = bio
        updates["age"] = int(age)
        updates["gender"] = gender

    else:
        return jsonify({"message": "Invalid step"}), 400

    doctors.update_one({"_id": ObjectId(doctor_id)}, {"$set": updates})
    updated_doctor = doctors.find_one({"_id": ObjectId(doctor_id)})

    return jsonify({
        "message": f"Profile step {step} completed successfully",
        "profileSetupCompleted": updated_doctor["profileSetupCompleted"],
        "doctor": {
            "id": str(updated_doctor["_id"]),
            "fullName": updated_doctor["fullName"],
            "email": updated_doctor["email"],
            "dob": updated_doctor["dob"].isoformat() if updated_doctor["dob"] else None,
            "gender": updated_doctor["gender"],
            "age": updated_doctor["age"],
            "hospitalName": updated_doctor["hospitalName"],
            "specialization": updated_doctor["specialization"],
            "licenseNumber": updated_doctor["licenseNumber"],
            "yearsOfExperience": updated_doctor["yearsOfExperience"],
            "profilePhoto": updated_doctor["profilePhoto"],
            "phone": updated_doctor["phone"],
            "bio": updated_doctor["bio"]
        }
    }), 200

@auth_bp.route("/update-password", methods=["POST"])
@jwt_required()
def update_password():
    data = request.json
    doctor_id = get_jwt_identity()
    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")
    print(data)

    if not all([current_password, new_password]):
        return jsonify({"message": "All fields are required"}), 400

    doctor = doctors.find_one({"_id": ObjectId(doctor_id)})
    if not doctor or not check_password_hash(doctor["password"], current_password):
        return jsonify({"message": "Invalid current password"}), 401

    hashed_new_password = generate_password_hash(new_password)
    doctors.update_one({"_id": ObjectId(doctor_id)}, {"$set": {"password": hashed_new_password}})

    return jsonify({"message": "Password updated successfully"}), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Logout successful"}), 200