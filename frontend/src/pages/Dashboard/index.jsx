import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/Sidebar';
import { WelcomeScreen } from '../../components/WelcomeScreen';
import { DashboardHome } from './DashboardHome';
import { Profile } from './Profile';
import { Upload } from './Upload';
import { ReportRetrieve } from './ReportRetrieve';
import { Settings } from './Settings';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun } from 'lucide-react';
import { ReportGenerated } from './ReportGenerated';
import './Dashboard.css';

export function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { user, isDarkMode, toggleDarkMode } = useAuth();

  return (
    <div className={`dashboard-page ${isDarkMode ? 'dark' : ''}`}>
      {showWelcome && <WelcomeScreen name={user?.name} onClose={() => setShowWelcome(false)} />}
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="dashboard-actions">
            <button
              onClick={toggleDarkMode}
              className="hover:bg-gray-100 toggle-button"
            >
              {isDarkMode ? <Sun className="toggle-icon" /> : <Moon className="toggle-icon" />}
            </button>
            <img
              src={user?.profileImage || 'https://via.placeholder.com/32'}
              alt={user?.name}
              className="dashboard-profile-image"
            />
          </div>
        </div>
        <div className="dashboard-main">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="upload" element={<Upload />} />
            <Route path="report-generated" element={<ReportGenerated />} />
            <Route path="report-retrieve" element={<ReportRetrieve />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}