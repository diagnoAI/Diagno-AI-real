import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import './ForgotPassword.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword, isDarkMode } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await forgotPassword(email);
    } catch (error) {
      toast.error(error.message || 'Failed to send reset OTP');
      setErrors({ email: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`forgot-password-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass forgot-password-container"
      >
        <h2 className="forgot-password-title">Forgot Password</h2>
        <p className="forgot-password-subtitle">
          Enter your email to receive a reset code.
        </p>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-wrapper">
              {email === '' && <Mail className="input-icon" />}
              <input
                id="email"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input ${errors.email ? 'border-red-500' : ''} ${
                  email === '' ? 'with-icon' : 'without-icon'
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="form-submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Send Reset Code'}
          </motion.button>
        </form>
        <p className="forgot-password-login">
          Back to{' '}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}