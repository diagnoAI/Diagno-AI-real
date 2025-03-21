import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import '../styles/Contact.css';

export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="contact-title"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="contact-subtitle"
          >
            Have questions? We're here to help.
          </motion.p>
        </div>

        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="contact-form-container glass"
          >
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="form-textarea focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="form-submit hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="contact-info"
          >
            <div className="contact-item">
              <Mail className="contact-icon" />
              <div>
                <h3 className="contact-item-title">Email</h3>
                <p className="contact-item-text">support@diagnoai.com</p>
              </div>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <div>
                <h3 className="contact-item-title">Phone</h3>
                <p className="contact-item-text">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <div>
                <h3 className="contact-item-title">Address</h3>
                <p className="contact-item-text">
                  123 Innovation Drive<br />
                  Silicon Valley, CA 94025
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}