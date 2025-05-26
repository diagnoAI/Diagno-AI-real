import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, isDarkMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setEmail('');
      setPassword('');
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass login-container"
      >
        <h2 className="login-title">Sign in to Diagno AI</h2>
        <form className="login-form" onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              {password === '' && <Lock className="input-icon" />}
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input ${errors.password ? 'border-red-500' : ''} ${
                  password === '' ? 'with-icon' : 'without-icon'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="form-submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Login'}
          </motion.button>
        </form>
        <div className="login-links">
          <p className="login-signup">
            Don’t have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
          <p className="forgot-password">
            Forgot your password?{' '}
            <Link to="/forgot-password" className="signup-link">
              Reset Password
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}