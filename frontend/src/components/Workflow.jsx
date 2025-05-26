import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  const { isDarkMode } = useAuth();

  // Animation variants for cards
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: [1, 1.05, 1], // Pulse effect
      transition: { 
        duration: 0.8, 
        scale: { duration: 0.4, times: [0, 0.5, 1] },
      },
    },
  };

  // Animation variants for icons
  const iconVariants = {
    initial: { scale: 0, rotate: -45 },
    animate: { 
      scale: [1, 1.2, 1], 
      rotate: 0, 
      transition: { 
        duration: 0.6, 
        scale: { duration: 0.4, times: [0, 0.5, 1] },
      },
    },
  };

  // Animation variants for connectors
  const connectorVariants = {
    initial: { width: 0, opacity: 0, scaleY: 1 },
    animate: { 
      width: '4rem', 
      opacity: 1, 
      scaleY: [1, 1.2, 1], // Wave effect
      transition: { 
        duration: 0.6, 
        ease: 'easeOut', 
        scaleY: { duration: 0.4, times: [0, 0.5, 1], delay: 0.6 },
      },
    },
  };

  // Animation variants for title letters
  const titleVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  // Split title into letters for animation
  const titleText = 'How It Works';
  const titleLetters = titleText.split('');

  return (
    <section id="workflow" className={`workflow ${isDarkMode ? 'dark-mode' : ''}`}>
      <motion.div 
        className="workflow-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="workflow-container">
        <div className="workflow-header">
          <motion.h2
            className="workflow-title"
            initial="initial"
            animate="animate"
          >
            {titleLetters.map((letter, index) => (
              <motion.span
                key={index}
                variants={titleVariants}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="workflow-subtitle"
          >
            Three simple steps to enhance your diagnostic process
          </motion.p>
        </div>

        <div className="workflow-grid">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="workflow-step"
            >
              <div className="workflow-card">
                <div className="workflow-icon-container">
                  <motion.div variants={iconVariants} initial="initial" animate="animate">
                    <step.icon className="workflow-icon" />
                  </motion.div>
                </div>
                <h3 className="workflow-step-title">{step.title}</h3>
                <p className="workflow-step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <motion.div
                  className="workflow-connector md:block"
                  variants={connectorVariants}
                  initial="initial"
                  animate="animate"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}