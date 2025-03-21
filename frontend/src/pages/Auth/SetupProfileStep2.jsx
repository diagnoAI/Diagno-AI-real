import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SetupProfileStep2.css';

export function SetupProfileStep2() {
  const [hospital, setHospital] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleNext = (e) => {
    e.preventDefault();
    if (hospital) {
      navigate('/setup-profile/step3', { state: { ...state, hospital } });
    }
  };

  return (
    <div className="setup-step2-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="setup-step2-container glass"
      >
        <h2 className="setup-step2-title">Enter Clinic/Hospital Name</h2>
        <form className="setup-step2-form" onSubmit={handleNext}>
          <div className="form-group">
            <label htmlFor="hospital" className="form-label">
              Clinic or Hospital
            </label>
            <input
              id="hospital"
              type="text"
              required
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="form-input focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="form-submit hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Next
          </button>
        </form>
      </motion.div>
    </div>
  );
}