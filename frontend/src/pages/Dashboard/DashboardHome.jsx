import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './DashboardHome.css';

export function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="dashboard-home-container glass">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-home-title"
      >
        Welcome Back, Dr. {user?.name}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="dashboard-home-text"
      >
        This is your dashboard. Use the sidebar to upload patient details, retrieve reports, or manage your settings.
      </motion.p>
    </div>
  );
}