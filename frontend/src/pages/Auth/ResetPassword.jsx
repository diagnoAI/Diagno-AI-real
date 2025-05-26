import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import './ResetPassword.css';

export function ResetPassword() {
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword, isDarkMode } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!passwordForm.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (!passwordForm.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await resetPassword({
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      toast.success('Password reset successfully! Redirecting to login...');
      // Safeguard redirect in case context doesn't handle it
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
      setErrors({ newPassword: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className={`reset-password-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass reset-password-container"
      >
        <h2 className="reset-password-title">Reset Password</h2>
        <p className="reset-password-subtitle">
          Enter your new password below.
        </p>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <div className="input-wrapper">
              {passwordForm.newPassword === '' && <Lock className="input-icon" />}
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                placeholder="Enter new password"
                onChange={handleInputChange}
                className={`form-input ${errors.newPassword ? 'border-red-500' : ''} ${
                  passwordForm.newPassword === '' ? 'with-icon' : 'without-icon'
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-wrapper">
              {passwordForm.confirmPassword === '' && <Lock className="input-icon" />}
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                placeholder="Confirm new password"
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''} ${
                  passwordForm.confirmPassword === '' ? 'with-icon' : 'without-icon'
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="form-submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Reset Password'}
          </motion.button>
        </form>
        <p className="reset-password-login">
          Back to{' '}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}