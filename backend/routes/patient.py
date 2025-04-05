from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime
import base64
from utils.compress import compress_image
import io
from PIL import Image
import numpy as np

# Import your AI model functions (assuming they are implemented)
from predict.classifies import classify_stone
from predict.segment import segment_stone
from predict.report import generate_report

patient_bp = Blueprint("patient", __name__)

def get_db():
    client = MongoClient("mongodb://localhost:27017/")
    return client["diagno_ai"]

db = get_db()
patients = db["patients"]

@patient_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_patient():
    doctor_id = get_jwt_identity()
    data = request.form
    patient_name = data.get("patientName")
    patient_id = data.get("patientId")
    age = data.get("age")
    gender = data.get("gender")
    date = data.get("date")
    ct_scan = request.files.get("ctScan") if "ctScan" in request.files else None

    if not all([patient_name, patient_id, age, gender, date, ct_scan]):
        return jsonify({"message": "All fields are required"}), 400

    # Validate patient ID uniqueness
    if patients.find_one({"patientId": patient_id}):
        return jsonify({"message": "Patient ID already exists"}), 400

    # Process the CT scan image
    image_data = ct_scan.read()
    image_size_mb = len(image_data) / (1024 * 1024)
    print(f"Original CT scan size: {image_size_mb:.2f} MB")

    if image_size_mb > 1:
        print("Compressing CT scan...")
        try:
            image_data = compress_image(image_data, max_size_mb=1, max_dimension=512, quality=85)
        except ValueError as e:
            return jsonify({"message": str(e)}), 400
        compressed_size_mb = len(image_data) / (1024 * 1024)
        print(f"Compressed CT scan size: {compressed_size_mb:.2f} MB")

    # Convert CT scan to base64
    base64_ct_scan = base64.b64encode(image_data).decode("utf-8")
    mime_type = ct_scan.mimetype
    base64_ct_scan = f"data:{mime_type};base64,{base64_ct_scan}"

    # Run AI models (classifier.py and segment.py)
    # Convert image data to a format suitable for the models
    image = Image.open(io.BytesIO(image_data))
    image_array = np.array(image)

    # Classify if stone is present
    has_stone = classify_stone(image_array)

    stone_details = None
    segmented_image_base64 = None
    risk_level = "Low"

    if has_stone:
        # Segment the stone and get details
        segmented_image, stone_info = segment_stone(image_array)
        stone_details = {
            "size": stone_info["size"],
            "shape": stone_info["shape"],
            "location": stone_info["location"],
            "position": stone_info["position"]
        }

        # Convert segmented image to base64
        segmented_image_pil = Image.fromarray(segmented_image)
        output = io.BytesIO()
        segmented_image_pil.save(output, format="JPEG")
        segmented_image_data = output.getvalue()
        segmented_image_base64 = base64.b64encode(segmented_image_data).decode("utf-8")
        segmented_image_base64 = f"data:image/jpeg;base64,{segmented_image_base64}"

        # Determine risk level based on stone size (example logic)
        if stone_info["size"] > 10:
            risk_level = "High"
        elif stone_info["size"] > 5:
            risk_level = "Medium"
        else:
            risk_level = "Low"

    # Generate report (using report.py)
    report_data = generate_report({
        "patientName": patient_name,
        "patientId": patient_id,
        "age": int(age),
        "gender": gender,
        "date": date,
        "ctScan": base64_ct_scan,
        "hasStone": has_stone,
        "stoneDetails": stone_details,
        "segmentedImage": segmented_image_base64,
        "riskLevel": risk_level
    })

    # Store in patients collection
    patient_record = {
        "patientName": patient_name,
        "patientId": patient_id,
        "age": int(age),
        "gender": gender,
        "date": datetime.datetime.strptime(date, "%Y-%m-%d"),
        "ctScan": base64_ct_scan,
        "segmentedImage": segmented_image_base64,
        "doctorId": ObjectId(doctor_id),
        "hasStone": has_stone,
        "stoneDetails": stone_details,
        "riskLevel": risk_level,
        "createdAt": datetime.datetime.utcnow(),
        "updatedAt": datetime.datetime.utcnow()
    }
    patient_id_mongo = patients.insert_one(patient_record).inserted_id

    return jsonify({
        "message": "Patient data uploaded and report generated",
        "patientId": str(patient_id_mongo),
        "report": report_data
    }), 201

@patient_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    doctor_id = get_jwt_identity()
    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = today.replace(day=1)

    # Patients today
    patients_today = patients.count_documents({
        "doctorId": ObjectId(doctor_id),
        "createdAt": {"$gte": today}
    })

    # Kidney stone scans today
    scans_today = patients.count_documents({
        "doctorId": ObjectId(doctor_id),
        "createdAt": {"$gte": today},
        "hasStone": True
    })

    # High risk patients today
    high_risk_today = patients.count_documents({
        "doctorId": ObjectId(doctor_id),
        "createdAt": {"$gte": today},
        "riskLevel": "High"
    })

    # Appointments (simulated as uploads for now)
    appointments_today = patients_today  # Adjust if you have a separate appointments collection

    # Detection accuracy (simulated for now, replace with actual model accuracy if available)
    detection_accuracy = 92

    # Total scans this month
    total_scans_month = patients.count_documents({
        "doctorId": ObjectId(doctor_id),
        "createdAt": {"$gte": month_start},
        "hasStone": True
    })

    # Average risk score (simulated for now)
    avg_risk_score = 7.8  # Replace with actual calculation if needed

    # Recent activity
    recent_activity = list(patients.find({
        "doctorId": ObjectId(doctor_id)
    }).sort("createdAt", -1).limit(3))
    recent_activity_formatted = [
        {
            "id": str(activity["_id"]),
            "action": "Scan Completed" if activity["hasStone"] else "Scan Completed (No Stone)",
            "patient": activity["patientName"],
            "time": activity["createdAt"].strftime("%I:%M %p")
        }
        for activity in recent_activity
    ]

    # Risk distribution
    risk_distribution = {
        "Low": patients.count_documents({"doctorId": ObjectId(doctor_id), "riskLevel": "Low"}),
        "Medium": patients.count_documents({"doctorId": ObjectId(doctor_id), "riskLevel": "Medium"}),
        "High": patients.count_documents({"doctorId": ObjectId(doctor_id), "riskLevel": "High"})
    }

    # Trend data (last 7 days)
    trend_data = []
    for i in range(6, -1, -1):
        day = today - datetime.timedelta(days=i)
        next_day = day + datetime.timedelta(days=1)
        scans = patients.count_documents({
            "doctorId": ObjectId(doctor_id),
            "createdAt": {"$gte": day, "$lt": next_day},
            "hasStone": True
        })
        trend_data.append(scans)

    return jsonify({
        "stats": {
            "patientsToday": patients_today,
            "scansToday": scans_today,
            "detectionAccuracy": detection_accuracy,
            "highRiskPatients": high_risk_today,
            "appointments": appointments_today
        },
        "quickStats": {
            "totalScansMonth": total_scans_month,
            "avgRiskScore": avg_risk_score
        },
        "recentActivity": recent_activity_formatted,
        "riskDistribution": risk_distribution,
        "trendData": trend_data
    }), 200

@patient_bp.route("/report/<patient_id>", methods=["GET"])
@jwt_required()
def get_patient_report(patient_id):
    doctor_id = get_jwt_identity()
    patient = patients.find_one({
        "_id": ObjectId(patient_id),
        "doctorId": ObjectId(doctor_id)
    })
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    return jsonify({
        "patient": {
            "id": str(patient["_id"]),
            "patientName": patient["patientName"],
            "patientId": patient["patientId"],
            "age": patient["age"],
            "gender": patient["gender"],
            "date": patient["date"].isoformat(),
            "ctScan": patient["ctScan"],
            "segmentedImage": patient["segmentedImage"],
            "hasStone": patient["hasStone"],
            "stoneDetails": patient["stoneDetails"],
            "riskLevel": patient["riskLevel"],
            "createdAt": patient["createdAt"].isoformat()
        }
    }), 200

@patient_bp.route("/reports", methods=["GET"])
@jwt_required()
def get_all_reports():
    doctor_id = get_jwt_identity()
    patient_reports = list(patients.find({"doctorId": ObjectId(doctor_id)}).sort("createdAt", -1))
    return jsonify({
        "reports": [
            {
                "id": str(report["_id"]),
                "patientName": report["patientName"],
                "patientId": report["patientId"],
                "date": report["date"].isoformat(),
                "riskLevel": report["riskLevel"],
                "hasStone": report["hasStone"]
            }
            for report in patient_reports
        ]
    }), 200