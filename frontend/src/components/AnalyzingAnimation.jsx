import React from 'react';
import { motion } from 'framer-motion';
import '../styles/AnalyzingAnimation.css';

export function AnalyzingAnimation() {
  return (
    <div className="analyzing-animation">
      <motion.div
        className="analyzing-circle"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <p className="analyzing-text">Analyzing CT Scan...</p>
    </div>
  );
}