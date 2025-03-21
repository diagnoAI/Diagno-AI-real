import React from 'react';
import { motion } from 'framer-motion';
import '../styles/About.css';

export function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="about-text"
          >
            <h2 className="about-title">
              About Diagno AI
            </h2>
            <div className="about-content">
              <p className="about-paragraph">
                Diagno AI was founded with a mission to revolutionize medical diagnostics through artificial intelligence. Our team of medical professionals and AI experts work together to create cutting-edge solutions that enhance diagnostic accuracy and efficiency.
              </p>
              <p className="about-paragraph">
                We understand the challenges healthcare providers face in delivering timely and accurate diagnoses. That's why we've developed an advanced AI-powered platform that assists medical professionals in analyzing CT scans with unprecedented precision.
              </p>
              <p className="about-paragraph">
                Our commitment to innovation, accuracy, and patient care drives us to continuously improve our technology, making it an indispensable tool for modern healthcare practitioners.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="about-image-wrapper"
          >
            <div className="about-image-container">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Medical professionals using technology"
                className="about-image"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}