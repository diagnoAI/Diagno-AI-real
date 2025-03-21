import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Shield, Stethoscope } from 'lucide-react';
import '../styles/Features.css'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms provide accurate and rapid analysis of CT scan images.',
  },
  {
    icon: Clock,
    title: 'Instant Results',
    description: 'Get detailed diagnostic reports within seconds, helping you make faster medical decisions.',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Your data is protected with enterprise-grade security, ensuring HIPAA compliance.',
  },
  {
    icon: Stethoscope,
    title: 'Doctor-Centric Design',
    description: 'Interface designed specifically for medical professionals, streamlining your workflow.',
  },
];

export function Features() {
  return (
    <section id="features" className="features">
      <div className="features-container">
        <div className="features-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="features-title"
          >
            Powerful Features for Medical Professionals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="features-subtitle"
          >
            Everything you need to enhance your diagnostic capabilities
          </motion.p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="feature-card glass hover:shadow-xl"
            >
              <div className="feature-icon-container">
                <feature.icon className="feature-icon" />
              </div>
              <h3 className="feature-title">
                {feature.title}
              </h3>
              <p className="feature-description">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}