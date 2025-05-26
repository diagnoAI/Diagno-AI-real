import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/AnalyzingAnimation.css';

export function AnalyzingAnimation() {
  const { isDarkMode } = useAuth();

  return (
    <div className={`analyzing-animation ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Animation Container for Loader Elements */}
      <div className="animation-container">
        {/* Outer Rotating Circle */}
        <motion.div
          className="analyzing-circle outer"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner Pulsating Circle */}
        <motion.div
          className="analyzing-circle inner"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Small Orbiting Dots */}
        <motion.div
          className="analyzing-dot"
          animate={{
            rotate: 360,
            transition: { duration: 2, repeat: Infinity, ease: 'linear' },
          }}
        >
          <motion.span
            className="dot"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="dot"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          />
        </motion.div>
        {/* Subtle Background Gradient Animation */}
        <motion.div
          className="background-overlay"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {/* Animated Text Below the Loader */}
      <motion.p
        className="analyzing-text"
        animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Analyzing CT Scan...
      </motion.p>
    </div>
  );
}