import React from 'react';
import '../styles/NotFound2.css'; // Adjust the path as necessary

const NotFound2 = () => {
  return (
    <div className="not-found-container">
      <div className="bubbles"></div>
      <div className="content-wrapper">
        <div className="error-circle">
          <h1 className="error-code">404</h1>
          <div className="ripple-effect"></div>
          <div className="ripple-effect ripple-delay"></div>
        </div>
        <h2 className="error-message">Kidney Stone Scan Failed</h2>
        <p className="error-description">
          Whoops! Our ultrasound waves couldn’t locate this page. 
          It might have dissolved or passed through our system!
        </p>
        <div className="kidney-animation">
          <div className="kidney">
            <div className="stone stone-1"></div>
            <div className="stone stone-2"></div>
            <div className="wave-scan"></div>
          </div>
        </div>
        <a href="/" className="home-button">
          <span>Back to Scanner</span>
          <div className="button-wave"></div>
        </a>
      </div>
    </div>
  );
};

export default NotFound2;