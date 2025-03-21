import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Workflow } from '../components/Workflow';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import './Landing.css';

export function Landing() {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <Workflow />
      <About />
      <Contact />
    </div>
  );
}