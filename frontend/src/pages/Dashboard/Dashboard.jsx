import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/Sidebar';
import { BottomBar } from '../../components/Bottombar'; // Import the new BottomBar component
import { WelcomeScreen } from '../../components/WelcomeScreen';
import { DashboardHome } from './DashboardHome';
import { Profile } from './Profile';
import { Upload } from './Upload';
import { ReportRetrieve } from './ReportRetrieve';
import { Settings } from './Settings';
import { ReportGenerated } from './ReportGenerated';
import { useAuth } from '../../context/AuthContext';
import { PatientReport } from './PatientReport';
import { Menu, ArrowLeft } from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { user, logout, isDarkMode } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  console.log('Current location in Dashboard:', location.pathname);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const mobile = window.innerWidth <= 768;
        console.log('Window width:', window.innerWidth, 'Is mobile:', mobile);
        setIsMobile(mobile);
        if (mobile) {
          setIsSidebarCollapsed(true);
        } else {
          setIsSidebarCollapsed(false);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <div className={`dashboard-wrapper ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Sidebar onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      )}

      {/* Top Bar for Mobile */}
      {isMobile && (
        <div className="dashboard-top-bar">
          <button
            className="top-bar-back-button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="top-bar-back-icon" />
          </button>
          <div className="top-bar-right">
            <button
              className="top-bar-hamburger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Menu className="top-bar-hamburger-icon" />
            </button>
            <img
              src={user?.profilePhoto || '/default-profile.png'}
              alt={user?.fullname}
              className="top-bar-profile-image"
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <button
                  onClick={() => {
                    navigate('/dashboard/settings');
                    setShowDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="dropdown-item"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`dashboard-content-wrapper ${
          isMobile ? 'mobile' : isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
      >
        {showWelcome && user && <WelcomeScreen name={user.fullname} onClose={() => setShowWelcome(false)} />}
        <div className="dashboard-main">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="upload" element={<Upload />} />
            <Route path="report-retrieve" element={<ReportRetrieve />} />
            <Route path="settings" element={<Settings />} />
            <Route path="report-generated" element={<ReportGenerated />} />
            <Route path="report/:patientId" element={<PatientReport />} />
            <Route path="*" element={<div>404: Route not found in Dashboard</div>} />
          </Routes>
        </div>
      </div>

      {/* Bottom Bar for Mobile */}
      {isMobile && <BottomBar />}
    </div>
  );
}