import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Lottie from 'lottie-react';
import kidneyAnimation from '../assets/Animation - 1744577087398.json'; // Adjust path as needed
import '../styles/Hero.css';

export function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated, isDarkMode } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Animation variants for the kidney logo
  const kidneyVariants = {
    initial: { y: '100vh', opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  return (
    <div className={`hero ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Background with animated gradient or galaxy effect */}
      <div className="hero-background">
        <div className="heartbeat-line"></div>
      </div>

      {/* Content */}
      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              variants={kidneyVariants}
              initial="initial"
              animate="animate"
              className="kidney-container"
            >
              <div className="smoke-effect"></div>
              <Lottie
                animationData={kidneyAnimation}
                loop={true}
                className="hero-kidney"
              />
            </motion.div>
            <motion.h1
              className="hero-title"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              Welcome to{' '}
              <span className="hero-title-highlight">
                Diagno AI
              </span>
            </motion.h1>
            <p className="hero-description">
              Empowering doctors with AI-powered diagnostics. Upload CT scans and get instant, accurate analysis to support your medical decisions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="hero-button"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}