import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Signup.css';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup({ email, password, name });
      toast.success('Signup successful! Please verify your email.');
      navigate('/otp');
    } catch (error) {
      toast.error(error.message || 'Signup failed. Please try again.');
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Email already in use' });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email address' });
      } else {
        setErrors({ email: 'Signup failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="signup-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="signup-container glass"
      >
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`form-input ${errors.name ? 'border-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'border-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${errors.password ? 'border-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`form-input ${errors.confirmPassword ? 'border-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="form-submit hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Sign Up'}
          </button>
        </form>
        <p className="signup-login">
          Already have an account? <Link to="/login" className="login-link">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}