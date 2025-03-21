import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Upload, FileText, Settings, LogOut, Menu, Home, ArrowLeft } from 'lucide-react'; // Add Home and ArrowLeft
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button
          className="hover:bg-gray-100 sidebar-back-button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="sidebar-back-icon" />
        </button>
        <h4 className='h4'>HOME</h4>
        <button
          className="hover:bg-gray-100 sidebar-toggle-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="sidebar-toggle-icon" />
        </button>
      </div>
      <div className="sidebar-profile">
        <img
          src={user?.profileImage || 'https://via.placeholder.com/100'}
          alt={user?.name}
          className="sidebar-profile-image"
        />
        {!isCollapsed && <h3 className="sidebar-profile-name">Dr. {user?.name}</h3>}
      </div>
      <nav className="sidebar-links">
        <Link to="/dashboard" className="sidebar-link">
          <div className="tooltip-wrapper">
            <Home className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Dashboard</span>}
            {!isCollapsed && 'Dashboard'}
          </div>
        </Link>
        <Link to="/dashboard/profile" className="sidebar-link">
          <div className="tooltip-wrapper">
            <User className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Profile</span>}
            {!isCollapsed && 'Profile'}
          </div>
        </Link>
        <Link to="/dashboard/upload" className="sidebar-link">
          <div className="tooltip-wrapper">
            <Upload className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Upload</span>}
            {!isCollapsed && 'Upload'}
          </div>
        </Link>
        <Link to="/dashboard/report-retrieve" className="sidebar-link">
          <div className="tooltip-wrapper">
            <FileText className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Report Retrieve</span>}
            {!isCollapsed && 'Report Retrieve'}
          </div>
        </Link>
        <Link to="/dashboard/settings" className="sidebar-link">
          <div className="tooltip-wrapper">
            <Settings className="sidebar-icon" />
            {isCollapsed && <span className="tooltip">Settings</span>}
            {!isCollapsed && 'Settings'}
          </div>
        </Link>
        <button
          onClick={() => {
            logout();
            navigate('/');
            
          }}
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