import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain } from 'lucide-react';
import '../styles/Hero.css';

export function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="hero">
      {/* Background with gradient */}
      <div className="hero-background" />
      
      {/* Content */}
      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Brain className="hero-icon" />
            <h1 className="hero-title">
              Welcome to{' '}
              <span className="hero-title-highlight">
                Diagno AI
              </span>
            </h1>
            <p className="hero-description">
              Empowering doctors with AI-powered diagnostics. Upload CT scans and get instant, accurate analysis to support your medical decisions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="hero-button hover:bg-blue-700"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}