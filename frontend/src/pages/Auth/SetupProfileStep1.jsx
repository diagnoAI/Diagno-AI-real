import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./SetupProfileStep1.css";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export function SetupProfileStep1() {
  const [fullname, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({ fullName: "", dob: "", gender: "" });
  const { setProfile1 } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullname: "", dob: "", gender: "" };

    if (!fullname) {
      newErrors.fullname = "Full Name is required";
      isValid = false;
    }

    if (!dob) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    }

    if (!gender) {
      newErrors.gender = "Please select your gender";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true); // Start loading state
      try {
        await setProfile1({ fullname, dob, gender });
        toast.success("Profile setup successful!");
        navigate("/setup-profile/step2"); // Redirect to the next step
      } catch (error) {
        toast.error("Profile setup failed. Please try again.");
      } finally {
        setIsLoading(false); // End loading state
      }
    }
  };

  return (
    <div className="setup-step1-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="setup-step1-container glass-effect"
      >
        <h2 className="setup-step1-title">Profile Setup</h2>
        <form className="setup-step1-form" onSubmit={handleNext}>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              className={`form-input ${errors.fullName ? "error" : ""}`}
              placeholder="Enter your full name"
            />
            {errors.fullname && <p className="error-text">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="dob" className="form-label">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`form-input ${errors.dob ? "error" : ""}`}
            />
            {errors.dob && <p className="error-text">{errors.dob}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`form-input ${errors.gender ? "error" : ""}`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="error-text">{errors.gender}</p>}
          </div>

          <div className="button-group">
            <button type="submit" className="next-button">
              {isLoading ? <span className="spinner"></span>  : "Next"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
