import React, { useEffect } from 'react'; // Add useEffect
import { motion } from 'framer-motion';
import { Workflow } from '../components/Workflow';
import '../styles/WorkflowPage.css';
import { useLocation } from 'react-router-dom'; // Add useLocation

export function WorkflowPage() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="workflow-page"
    >
      <Workflow />
    </motion.main>
  );
}