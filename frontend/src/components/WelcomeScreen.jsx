import React from 'react';
import { motion } from 'framer-motion';
import '../styles/WelcomeScreen.css';

export function WelcomeScreen({ name, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="welcome-screen"
      onClick={onClose}
    >
      <div className="welcome-content glass">
        <h2 className="welcome-title">Welcome Dr. {name}</h2>
        <p className="welcome-text">Tap anywhere to continue</p>
      </div>
    </motion.div>
  );
}