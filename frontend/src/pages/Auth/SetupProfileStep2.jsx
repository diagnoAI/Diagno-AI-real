import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./SetupProfileStep2.css";

export function SetupProfileStep2() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [hospital, setHospital] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!hospital) {
      newErrors.hospital = "Clinic/Hospital Name is required";
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

    if (!experience || isNaN(experience) || experience < 0 || experience > 60) {
      newErrors.experience = "Enter valid experience (0-60 years)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate("/setup-profile/step3", {
        state: { ...state, hospital, specialization, licenseNumber, experience },
      });
    }
  };

  const handleBack = () => {
    navigate("/setup-profile/step1", { state });
  };

  return (
    <div className="setup-step2-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="setup-step2-container glass"
      >
        <h2 className="setup-step2-title">Professional Details</h2>
        <form className="setup-step2-form" onSubmit={handleNext}>
          {/* Hospital/Clinic Name */}
          <div className="form-group">
            <label htmlFor="hospital" className="form-label">
              Clinic/Hospital Name
            </label>
            <input
              id="hospital"
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className={`form-input ${errors.hospital ? "error" : ""}`}
              placeholder="Enter your clinic or hospital name"
            />
            {errors.hospital && <p className="error-text">{errors.hospital}</p>}
          </div>

          {/* Specialization Dropdown */}
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

          {/* Medical License Number */}
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

          {/* Years of Experience */}
          <div className="form-group">
            <label htmlFor="experience" className="form-label">
              Years of Experience
            </label>
            <input
              id="experience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={`form-input ${errors.experience ? "error" : ""}`}
              min="0"
              max="60"
            />
            {errors.experience && (
              <p className="error-text">{errors.experience}</p>
            )}
          </div>

          {/* Navigation Buttons */}
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
            >
              Next
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
