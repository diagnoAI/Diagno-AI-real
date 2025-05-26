import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Upload, FileText, Settings, LogOut, Menu, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

export function Sidebar({ onToggle }) {
  const { user, logout, isDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <button
            className="sidebar-back-button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="sidebar-back-icon" />
          </button>
          {!isCollapsed && <h4 className="h4">HOME</h4>}
        </div>
        <button
          className="sidebar-toggle-button"
          onClick={toggleSidebar}
        >
          <Menu className="sidebar-toggle-icon" />
        </button>
      </div>
      <div className="sidebar-profile">
        <img
          src={user?.profilePhoto || 'https://via.placeholder.com/150'}
          alt={user?.fullName}
          className="sidebar-profile-image"
        />
        {!isCollapsed && <h3 className="sidebar-profile-name">Dr. {user?.fullName}</h3>}
      </div>
      <nav className="sidebar-links">
        <Link
          to="/dashboard"
          className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <div className="tooltip-wrapper">
            <Home className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Dashboard</span>}
            {!isCollapsed && 'Dashboard'}
          </div>
        </Link>
        <Link
          to="/dashboard/profile"
          className={`sidebar-link ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}
        >
          <div className="tooltip-wrapper">
            <User className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Profile</span>}
            {!isCollapsed && 'Profile'}
          </div>
        </Link>
        <Link
          to="/dashboard/upload"
          className={`sidebar-link ${location.pathname === '/dashboard/upload' ? 'active' : ''}`}
        >
          <div className="tooltip-wrapper">
            <Upload className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Upload</span>}
            {!isCollapsed && 'Upload'}
          </div>
        </Link>
        <Link
          to="/dashboard/report-retrieve"
          className={`sidebar-link ${location.pathname === '/dashboard/report-retrieve' ? 'active' : ''}`}
        >
          <div className="tooltip-wrapper">
            <FileText className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Report Retrieve</span>}
            {!isCollapsed && 'Report Retrieve'}
          </div>
        </Link>
        <Link
          to="/dashboard/settings"
          className={`sidebar-link ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}
        >
          <div className="tooltip-wrapper">
            <Settings className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Settings</span>}
            {!isCollapsed && 'Settings'}
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="sidebar-link sidebar-logout"
        >
          <div className="tooltip-wrapper">
            <LogOut className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Logout</span>}
            {!isCollapsed && 'Logout'}
          </div>
        </button>
      </nav>
    </div>
  );
}