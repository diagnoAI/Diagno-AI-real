import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Contact.css'; // Assuming you have a CSS file for styles

export function Contact() {
  const { isDarkMode } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className={`contact ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="contact-container">
        <div className="contact-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="contact-title"
          >
            Contact Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="contact-subtitle"
          >
            Connect with Diagno AI for support or inquiries.
          </motion.p>
        </div>

        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="contact-details glass"
          >
            <h3 className="contact-item-title">Get in Touch</h3>
            <div className="contact-item">
              <Mail className="contact-icon" />
              <div>
                <h4 className="contact-item-subtitle">Email</h4>
                <a href="mailto:diagnoai@gmail.com" className="contact-item-text">
                  diagnoai@gmail.com
                </a>
              </div>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <div>
                <h4 className="contact-item-subtitle">Phone</h4>
                <a href="tel:+919344422588" className="contact-item-text">
                  +91 9344422588
                </a>
              </div>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <div>
                <h4 className="contact-item-subtitle">Address</h4>
                <p className="contact-item-text">
                  Sadakathulla Appa College
                  <br />
                  Tirunelveli, Tamil Nadu, India - 627008
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="contact-info glass"
          >
            <h3 className="contact-item-title">Contact Diagno AI Team</h3>
            <p className="contact-info-text">
              If you had any questions or feedback, please feel free to reach out to us. We are here to help you with any inquiries you may have regarding our services or features.
            </p>
            <h4 className="contact-item-subtitle">Support Hours</h4>
            <p className="contact-info-text">
              Monday - Friday: 9:00 AM - 6:00 PM IST
              <br />
              Saturday: 10:00 AM - 2:00 PM IST
            </p>
            <p className="contact-info-cta">
              Reach out to us anytime via email or phone!
            </p>
          </motion.div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="social-links">
            <a
              href="https://instagram.com"
              className="social-link instagram"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 16 16" className="social-icon instagram-icon">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 1 1 0-5.334z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              className="social-link twitter"
              aria-label="Twitter"
            >
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="social-icon twitter-icon"
              >
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              className="social-link linkedin"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 448 512" className="social-icon linkedin-icon">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
              </svg>
            </a>
            <a
              href="https://whatsapp.com"
              className="social-link whatsapp"
              aria-label="WhatsApp"
            >
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="social-icon whatsapp-icon"
              >
                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
              </svg>
            </a>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/features" className="nav-link">
              Features
            </Link>
            <button onClick={scrollToTop} className="nav-link back-to-top">
              Back to Top <ArrowUp className="back-to-top-icon" />
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}