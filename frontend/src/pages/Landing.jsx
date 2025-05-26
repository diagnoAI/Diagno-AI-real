import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Workflow } from '../components/Workflow';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export function Landing() {
  const { isDarkMode } = useAuth();

  return (
    <div className={`landing-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <Hero />
      <Features />
      <Workflow />
      <About />
      <Contact />
    </div>
  );
}