import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/About.css';

export function About() {
  const { isDarkMode } = useAuth();

  // Animation variants for image
  const imageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: [0, -10, 0], // Bounce effect
      transition: {
        duration: 0.8,
        y: { duration: 0.6, times: [0, 0.5, 1], ease: 'easeOut' },
      },
    },
  };

  // Animation variants for paragraphs
  const paragraphVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className={`about ${isDarkMode ? 'dark-mode' : ''}`}>
      <motion.div
        className="about-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
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
              <span className="title-underline"></span>
            </h2>
            <div className="about-content">
              {[
                "Diagno AI was founded with a mission to revolutionize medical diagnostics through artificial intelligence. Our team of medical professionals and AI experts work together to create cutting-edge solutions that enhance diagnostic accuracy and efficiency.",
                "We understand the challenges healthcare providers face in delivering timely and accurate diagnoses. That's why we've developed an advanced AI-powered platform that assists medical professionals in analyzing CT scans with unprecedented precision.",
                "Our commitment to innovation, accuracy, and patient care drives us to continuously improve our technology, making it an indispensable tool for modern healthcare practitioners.",
              ].map((text, index) => (
                <motion.p
                  key={index}
                  variants={paragraphVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="about-paragraph"
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={imageVariants}
            initial="initial"
            animate="animate"
            className="about-image-wrapper"
            whileHover={{ rotateX: 5, rotateY: 5, transition: { duration: 0.3 } }} // Parallax tilt
          >
            <div className="about-image-container">
              <img
                src="src/assets/doctor.jpg"
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