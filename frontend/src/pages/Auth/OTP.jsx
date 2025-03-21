import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './OTP.css';

export function OTP() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOTP(otp);
      toast.success('Email verified!');
      navigate('/setup-profile/step1'); // Redirect to profile setup
    } catch (error) {
      toast.error('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="otp-container glass"
      >
        <h2 className="otp-title">Verify Your Email</h2>
        <form className="otp-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp" className="form-label">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-input focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="form-submit hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Verify'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}