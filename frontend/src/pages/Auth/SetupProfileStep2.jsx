import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./SetupProfileStep2.css";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export function SetupProfileStep2() {
  const navigate = useNavigate();
  const { setupProfile, user, loading } = useAuth();
  const [hospitalName, setHospitalName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const specializations = [
    "Urologist",
    "Radiologist",
    "Cardiologist",
    "Neurologist",
    "Oncologist",
    "Orthopedist",
    "Pediatrician",
    "Dermatologist",
    "Gastroenterologist",
    "Endocrinologist",
    "Nephrologist",
    "Pulmonologist",
    "Rheumatologist",
    "Hematologist",
    "General Practitioner",
  ];

  useEffect(() => {
    if (!user?.isVerified) {
      navigate("/otp");
    }
    // Wait until loading is false and user is updated
    if (!loading && user) {
      if (!user.dob || !user.gender) {
        navigate("/setup-profile/step1");
      }
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!hospitalName) {
      newErrors.hospitalName = "Clinic/Hospital Name is required";
      isValid = false;
    }

    if (!specialization) {
      newErrors.specialization = "Specialization is required";
      isValid = false;
    }

    if (!licenseNumber) {
      newErrors.licenseNumber = "Medical License Number is required";
      isValid = false;
    }

    if (!yearsOfExperience || isNaN(yearsOfExperience) || yearsOfExperience < 0 || yearsOfExperience > 60) {
      newErrors.yearsOfExperience = "Enter valid experience (0-60 years)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await setupProfile("2", {
          hospitalName,
          specialization,
          licenseNumber,
          yearsOfExperience
        });
        toast.success("Profile setup step 2 completed!");
        // Navigation is handled in AuthContext
      } catch (error) {
        toast.error(error.message || "Profile setup failed. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate("/setup-profile/step1");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="setup-step2-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="setup-step2-container glass"
      >
        <h2 className="setup-step2-title">Professional Details</h2>
        <form className="setup-step2-form" onSubmit={handleNext}>
          <div className="form-group">
            <label htmlFor="hospital" className="form-label">
              Clinic/Hospital Name
            </label>
            <input
              id="hospital"
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className={`form-input ${errors.hospitalName ? "error" : ""}`}
              placeholder="Enter your clinic or hospital name"
            />
            {errors.hospitalName && <p className="error-text">{errors.hospitalName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="specialization" className="form-label">
              Specialization
            </label>
            <select
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className={`form-input ${errors.specialization ? "error" : ""}`}
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {errors.specialization && (
              <p className="error-text">{errors.specialization}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="licenseNumber" className="form-label">
              Medical License Number
            </label>
            <input
              id="licenseNumber"
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className={`form-input ${errors.licenseNumber ? "error" : ""}`}
              placeholder="Enter your license number"
            />
            {errors.licenseNumber && (
              <p className="error-text">{errors.licenseNumber}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="experience" className="form-label">
              Years of Experience
            </label>
            <input
              id="experience"
              type="number"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className={`form-input ${errors.yearsOfExperience ? "error" : ""}`}
              min="0"
              max="60"
            />
            {errors.yearsOfExperience && (
              <p className="error-text">{errors.yearsOfExperience}</p>
            )}
          </div>

          <div className="form-buttons">
            <button
              type="button"
              onClick={handleBack}
              className="form-button back-button"
            >
              Back
            </button>
            <button
              type="submit"
              className="form-button next-button"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner"></span> : "Next"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}