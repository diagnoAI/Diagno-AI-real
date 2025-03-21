import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { About } from '../components/About';
import '../styles/AboutPage.css';
import { useLocation } from 'react-router-dom';

export function AboutPage() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  } , [location.pathname]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="about-page"
    >
      <About />
    </motion.main>
  );
}