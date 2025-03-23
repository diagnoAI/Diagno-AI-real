import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth(); // Add user to detect logout
  const navigate = useNavigate();

  // Reset form fields when user is null (after logout)
  useEffect(() => {
    if (!user) {
      setEmail('');
      setPassword('');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass login-container"
      >
        <h2 className="login-title">Sign in to Diagno AI</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="form-submit focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Login'}
          </button>
        </form>
        <p className="login-signup">
          Don’t have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}