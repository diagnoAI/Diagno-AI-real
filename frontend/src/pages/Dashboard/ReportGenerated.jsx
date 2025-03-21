import React from 'react';
import { motion } from 'framer-motion';
import './ReportGenerated.css';

export function ReportGenerated() {
  return (
    <div className="glass report-generated-container">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="report-generated-title"
      >
        Report Generated
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="report-generated-text"
      >
        The analysis is complete, and the report has been generated. You can view the report below.
      </motion.p>
      <div className="report-placeholder">
        <p>Report content will be displayed here.</p>
      </div>
    </div>
  );
}