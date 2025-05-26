import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Settings.css';

export function Settings() {
  const { user, isDarkMode, toggleDarkMode, updatePassword } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: true,
    updates: false,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success('Notification settings updated');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting password update:', passwordForm);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password do not match');
      setIsSubmitting(false);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error('New password must be different from current password');
      setIsSubmitting(false);
      return;
    }
    if (!passwordForm.currentPassword) {
      toast.error('Current password is required');
      setIsSubmitting(false);
      return;
    }
    if (!passwordForm.newPassword) {
      toast.error('New password is required');
      setIsSubmitting(false);
      return;
    }
    if (!passwordForm.confirmPassword) {
      toast.error('Confirm password is required');
      setIsSubmitting(false);
      return;
    }
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      console.log('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password update failed:', error.message);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`settings-container ${isDarkMode ? 'dark' : ''}`}
    >
      <div className="settings-wrapper">
        <h2 className="settings-title">Settings</h2>
        <div className="settings-sections">
          {/* Notifications */}
          <div className="settings-section">
            <div className="section-header">
              <Bell className="section-icon" />
              <h3 className="section-title">Notifications</h3>
            </div>
            <div className="section-content">
              <div className="notification-item">
                <div>
                  <p className="notification-label">Email Notifications</p>
                  <p className="notification-desc">Receive email updates about your scans</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('email')}
                  className={`toggle-switch ${notifications.email ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
              <div className="notification-item">
                <div>
                  <p className="notification-label">Desktop Notifications</p>
                  <p className="notification-desc">Get desktop alerts for important updates</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('desktop')}
                  className={`toggle-switch ${notifications.desktop ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
              <div className="notification-item">
                <div>
                  <p className="notification-label">Product Updates</p>
                  <p className="notification-desc">Receive updates about new features</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('updates')}
                  className={`toggle-switch ${notifications.updates ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="settings-section">
            <div className="section-header">
              <Lock className="section-icon" />
              <h3 className="section-title">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="section-content">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="password-input">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="form-input"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="password-toggle"
                    disabled={isSubmitting}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="toggle-icon" />
                    ) : (
                      <Eye className="toggle-icon" />
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="password-input">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="form-input"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="password-toggle"
                    disabled={isSubmitting}
                  >
                    {showNewPassword ? (
                      <EyeOff className="toggle-icon" />
                    ) : (
                      <Eye className="toggle-icon" />
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Appearance */}
          <div className="settings-section">
            <div className="section-header">
              {isDarkMode ? (
                <Moon className="section-icon" />
              ) : (
                <Sun className="section-icon" />
              )}
              <h3 className="section-title">Appearance</h3>
            </div>
            <div className="section-content">
              <div className="notification-item">
                <div>
                  <p className="notification-label">Dark Mode</p>
                  <p className="notification-desc">Toggle dark mode on or off</p>
                </div>
                <button
                  onClick={() => {
                    toggleDarkMode();
                    toast.success(`${isDarkMode ? 'Light' : 'Dark'} mode enabled`);
                  }}
                  className={`toggle-switch ${isDarkMode ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}