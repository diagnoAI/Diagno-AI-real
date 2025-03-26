import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, FileText, User } from 'lucide-react';
import '../styles/BottomBar.css';

export function BottomBar() {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const location = useLocation();

  const handleIconClick = (tooltip) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTooltip = activeTooltip === tooltip ? null : tooltip;
    setActiveTooltip(newTooltip);

    if (newTooltip) {
      const id = setTimeout(() => {
        setActiveTooltip(null);
      }, 2000);
      setTimeoutId(id);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div className="bottom-bar">
      <div className="bottom-bar-item-wrapper">
        <Link
          to="/dashboard"
          className={`bottom-bar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => handleIconClick('dashboard')}
        >
          <Home className="bottom-bar-icon" />
          {activeTooltip === 'dashboard' && (
            <span className="bottom-bar-tooltip">Dashboard</span>
          )}
        </Link>
      </div>
      <div className="bottom-bar-item-wrapper">
        <Link
          to="/dashboard/upload"
          className={`bottom-bar-item ${location.pathname === '/dashboard/upload' ? 'active' : ''}`}
          onClick={() => handleIconClick('upload')}
        >
          <Plus className="bottom-bar-icon" />
          {activeTooltip === 'upload' && (
            <span className="bottom-bar-tooltip">Upload</span>
          )}
        </Link>
      </div>
      <div className="bottom-bar-item-wrapper">
        <Link
          to="/dashboard/report-retrieve"
          className={`bottom-bar-item ${location.pathname === '/dashboard/report-retrieve' ? 'active' : ''}`}
          onClick={() => handleIconClick('report-retrieve')}
        >
          <FileText className="bottom-bar-icon" />
          {activeTooltip === 'report-retrieve' && (
            <span className="bottom-bar-tooltip">Report Retrieve</span>
          )}
        </Link>
      </div>
      <div className="bottom-bar-item-wrapper">
        <Link
          to="/dashboard/profile"
          className={`bottom-bar-item ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}
          onClick={() => handleIconClick('profile')}
        >
          <User className="bottom-bar-icon" />
          {activeTooltip === 'profile' && (
            <span className="bottom-bar-tooltip">Profile</span>
          )}
        </Link>
      </div>
    </div>
  );
}