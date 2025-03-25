import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/Sidebar';
import { WelcomeScreen } from '../../components/WelcomeScreen';
import { DashboardHome } from './DashboardHome';
import { Profile } from './Profile';
import { Upload } from './Upload';
import { ReportRetrieve } from './ReportRetrieve';
import { Settings } from './Settings';
import { ReportGenerated } from './ReportGenerated';
import { useAuth } from '../../context/AuthContext';
import { PatientReport } from './PatientReport';
import { Moon, Sun } from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { user, isDarkMode, toggleDarkMode } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync sidebar collapse state with window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`dashboard-wrapper ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      <div
        className={`dashboard-content-wrapper ${
          isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
      >
        {showWelcome && <WelcomeScreen name={user?.name} onClose={() => setShowWelcome(false)} />}
        <div className="dashboard-main">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="upload" element={<Upload />} />
            <Route path="report-retrieve" element={<ReportRetrieve />} />
            <Route path="settings" element={<Settings />} />
            <Route path="report-generated" element={<ReportGenerated />} />
            <Route path="/report/:patientId" element={<PatientReport />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}