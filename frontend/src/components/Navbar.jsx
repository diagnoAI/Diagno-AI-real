import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import '../styles/Navbar.css';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for click toggle

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/workflow', label: 'Workflow' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Toggle on click
  const closeDropdown = () => setIsDropdownOpen(false); // Close on action

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <Stethoscope className="navbar-logo-icon" />
            <span className="navbar-logo-text">Diagno AI</span>
          </Link>

          <div className="navbar-links md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx('nav-link', {
                  'active': location.pathname === link.path,
                })}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="navbar-indicator"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="navbar-user">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="navbar-user-button"
                  onClick={toggleDropdown} // Toggle on click
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="navbar-user-image"
                    />
                  ) : (
                    <User className="navbar-user-icon" />
                  )}
                </motion.button>
                <div
                  className={clsx('navbar-dropdown', {
                    'navbar-dropdown-open': isDropdownOpen, // Open on click
                  })}
                >
                  <Link
                    to="/dashboard"
                    className="navbar-dropdown-item hover:bg-gray-100"
                    onClick={closeDropdown} // Close on click
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeDropdown(); // Close on logout
                    }}
                    className="navbar-dropdown-button hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="navbar-login hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}