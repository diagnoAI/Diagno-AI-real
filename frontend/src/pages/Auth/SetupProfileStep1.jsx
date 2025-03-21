import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SetupProfileStep1.css';

export function SetupProfileStep1() {
  const [name, setName] = useState('');
  const [error, setError] = useState(''); // Add error state
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
    } else if (name.length < 2) {
      setError('Name must be at least 2 characters');
    } else {
      setError('');
      navigate('/setup-profile/step2', { state: { name } });
    }
  };

  return (
    <div className="setup-step1-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="setup-step1-container glass"
      >
        <h2 className="setup-step1-title">Enter Your Name</h2>
        <form className="setup-step1-form" onSubmit={handleNext}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`form-input focus:border-blue-500 focus:ring-blue-500 ${error ? 'error' : ''}`}
            />
            {error && <p className="error-text">{error}</p>}
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