import React from 'react';
import '../styles/NotFound.css'; // Import your CSS file for styling

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="stars"></div>
      <div className="content-wrapper">
        <h1 className="error-code">404</h1>
        <h2 className="error-message">Page Not Found</h2>
        <p className="error-description">
          Oops! Looks like you've wandered into the cosmic void.
          The page you're looking for doesn't exist in this universe.
        </p>
        <div className="astronaut">
          <div className="helmet"></div>
          <div className="visor"></div>
          <div className="suit"></div>
          <div className="jetpack">
            <div className="flame"></div>
          </div>
        </div>
        <a href="/" className="home-button">
          Return to Earth
        </a>
      </div>
    </div>
  );
};

export default NotFound;