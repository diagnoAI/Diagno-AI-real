from bson.objectid import ObjectId
import datetime

def doctor_schema():
    return {
        "_id": ObjectId,
        "name": str,
        "email": str,
        "password": str,  # Hashed password
        "isVerified": bool,
        "hospital": str,
        "profileImage": str,
        "createdAt": datetime.datetime,
        "updatedAt": datetime.datetime
    }