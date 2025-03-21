import React from 'react';
import { motion } from 'framer-motion';
import { Features } from '../components/Features';
import '../styles/FeaturesPage.css';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function FeaturesPage() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="features-page"
    >
      <Features />
    </motion.main>
  );
}