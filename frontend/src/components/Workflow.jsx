import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, FileText } from 'lucide-react';
import '../styles/Workflow.css';

const steps = [
  {
    icon: Upload,
    title: 'Upload CT Scan',
    description: 'Simply upload your patient\'s CT scan images through our secure interface.',
  },
  {
    icon: Search,
    title: 'AI Analysis',
    description: 'Our advanced AI algorithms analyze the images with high precision.',
  },
  {
    icon: FileText,
    title: 'Get Results',
    description: 'Receive detailed diagnostic reports with highlighted areas of interest.',
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="workflow">
      <div className="workflow-container">
        <div className="workflow-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} // Changed from whileInView
            transition={{ duration: 0.5 }}
            className="workflow-title"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} // Changed from whileInView
            transition={{ duration: 0.5, delay: 0.2 }}
            className="workflow-subtitle"
          >
            Three simple steps to enhance your diagnostic process
          </motion.p>
        </div>

        <div className="workflow-grid">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} // Changed from whileInView
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="workflow-step"
            >
              <div className="workflow-card glass">
                <div className="workflow-icon-container">
                  <step.icon className="workflow-icon" />
                </div>
                <h3 className="workflow-step-title">{step.title}</h3>
                <p className="workflow-step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="workflow-connector md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}