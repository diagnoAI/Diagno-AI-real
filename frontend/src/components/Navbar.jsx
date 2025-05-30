import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Lottie from 'lottie-react';
import kidneyAnimation from '../assets/Animation - 1744577087398.json'; // Adjust path as needed
import { clsx } from 'clsx';
import '../styles/Navbar.css';

export function Navbar() {
  const { isAuthenticated, user, logout, isDarkMode } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/workflow', label: 'Workflow' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo on Left */}
          <Link to="/" className="navbar-logo" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
            <Lottie
              animationData={kidneyAnimation}
              loop={true}
              className="navbar-logo-icon"
            />
            <span className="navbar-logo-text">Diagno AI</span>
          </Link>

          {/* Centered Desktop Nav Links */}
          <div className="navbar-links md:flex hidden">
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

          {/* Right Side: User Icon + Hamburger */}
          <div className="navbar-right">
            <div className="navbar-auth">
              {isAuthenticated ? (
                <div className="navbar-user">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="navbar-user-button"
                    onClick={toggleDropdown}
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.fullname}
                        className="navbar-user-image"
                      />
                    ) : (
                      <User className="navbar-user-icon" />
                    )}
                  </motion.button>
                  <div
                    className={clsx('navbar-dropdown', {
                      'navbar-dropdown-open': isDropdownOpen,
                    })}
                  >
                    <Link
                      to="/dashboard"
                      className="navbar-dropdown-item"
                      onClick={closeDropdown}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeDropdown();
                      }}
                      className="navbar-dropdown-button"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="navbar-login"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Single Hamburger Button */}
            <button
              className="navbar-hamburger md:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="navbar-hamburger-icon" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="navbar-mobile-menu md:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="navbar-mobile-link"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}