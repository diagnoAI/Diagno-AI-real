import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './OTP.css';

export function OTP() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Timer for resend OTP
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus(); // Auto-focus on OTP input field
    const timer =
      resendTimer > 0 &&
      setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(otp);
      toast.success('Email verified successfully!');
      navigate('/setup-profile/step1'); // Redirect to profile setup
    } catch (error) {
      toast.error(error.message || 'Invalid OTP, please try again.');
      setOtp(''); // Clear OTP input on error
      inputRef.current?.focus(); // Refocus on OTP input field
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP();
      toast.success('New OTP sent to your email.');
      setResendTimer(30); // Restart timer
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP.');
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
            <label htmlFor="otp" className="form-label">Enter OTP</label>
            <input
              id="otp"
              type="text"
              required
              value={otp}
              ref={inputRef}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Allow only numbers
                if (value.length <= 6) setOtp(value);
              }}
              className="form-input focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
              placeholder="Enter 6-digit OTP"
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

        {/* Resend OTP Button */}
        <button
          className="resend-otp"
          onClick={handleResendOTP}
          disabled={resendTimer > 0}
        >
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
        </button>
      </motion.div>
    </div>
  );
}
