import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import './VerifyCode.css';

export function VerifyCode() {
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { verifyResetCode, forgotPassword, isDarkMode } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!otp) newErrors.otp = 'OTP is required';
    else if (!/^\d{6}$/.test(otp)) newErrors.otp = 'OTP must be 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await verifyResetCode(otp);
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
      setErrors({ otp: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const email = localStorage.getItem('resetEmail');
      if (!email) throw new Error('Email not found, please start the reset process again.');
      await forgotPassword(email);
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={`verify-code-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass verify-code-container"
      >
        <h2 className="verify-code-title">Verify Reset Code</h2>
        <p className="verify-code-subtitle">
          Enter the 6-digit code sent to your email.
        </p>
        <form className="verify-code-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp" className="form-label">
              OTP
            </label>
            <div className="input-wrapper">
              {otp === '' && <Lock className="input-icon" />}
              <input
                id="otp"
                type="text"
                value={otp}
                placeholder="Enter 6-digit code"
                onChange={(e) => setOtp(e.target.value)}
                className={`form-input ${errors.otp ? 'border-red-500' : ''} ${
                  otp === '' ? 'with-icon' : 'without-icon'
                }`}
                disabled={isLoading}
                maxLength="6"
              />
            </div>
            {errors.otp && <p className="error-text">{errors.otp}</p>}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="form-submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Verify Code'}
          </motion.button>
        </form>
        <p className="verify-code-resend">
          Didn’t receive a code?{' '}
          <button
            onClick={handleResend}
            className="resend-link"
            disabled={isResending}
          >
            Resend OTP
          </button>
        </p>
        <p className="verify-code-login">
          Back to{' '}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}