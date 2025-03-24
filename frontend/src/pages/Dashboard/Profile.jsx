import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Award, Mail, Phone, Upload, Edit2, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Profile.css';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    console.log('No user data - redirecting to login');
    navigate('/'); // Redirect to login if no user
    return null;
  }

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    specialization: user?.specialization || '',
    hospital: user?.hospital || '',
    experience: user?.experience || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || null,
    bio: user?.bio || '',
  });
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || '/default-profile.png');

  useEffect(() => {
    if (formData.profileImage && typeof formData.profileImage !== 'string') {
      const url = URL.createObjectURL(formData.profileImage);
      setProfileImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setProfileImagePreview(formData.profileImage || '/default-profile.png');
    }
  }, [formData.profileImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData((prev) => ({ ...prev, profileImage: acceptedFiles[0] }));
    },
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
      Object.assign(user, formData); // Sync user data
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ profileImage: formData.profileImage });
      toast.success('Profile photo updated successfully');
      setIsEditingPhoto(false);
      Object.assign(user, { profileImage: formData.profileImage }); // Sync photo
    } catch (error) {
      toast.error('Failed to update photo');
    }
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setFormData({
      name: user?.name || '',
      specialization: user?.specialization || '',
      hospital: user?.hospital || '',
      experience: user?.experience || '',
      email: user?.email || '',
      phone: user?.phone || '',
      profileImage: user?.profileImage || null,
      bio: user?.bio || '',
    });
  };

  const handlePhotoCancel = () => {
    setIsEditingPhoto(false);
    setFormData((prev) => ({ ...prev, profileImage: user?.profileImage || null }));
    setProfileImagePreview(user?.profileImage || '/default-profile.png');
  };

  const removeProfileImage = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setProfileImagePreview('/default-profile.png');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="profile-container"
    >
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">Doctor Profile</h1>
          {/* Buttons stay here for desktop */}
          <div className="header-buttons desktop-buttons">
            {!isEditingProfile && !isEditingPhoto && (
              <>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="edit-profile-button"
                >
                  <Edit2 className="edit-icon" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsEditingPhoto(true)}
                  className="edit-photo-button"
                >
                  <Camera className="edit-icon" />
                  Edit Profile Photo
                </button>
              </>
            )}
          </div>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hospital/Clinic</label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="form-input form-textarea"
                  rows="3"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" onClick={handleProfileCancel} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="form-submit">Save Changes</button>
            </div>
          </form>
        ) : isEditingPhoto ? (
          <form onSubmit={handlePhotoSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Profile Photo</label>
                <div {...getRootProps()} className="profile-dropzone">
                  <input {...getInputProps()} />
                  {profileImagePreview && profileImagePreview !== '/default-profile.png' ? (
                    <div className="profile-image-preview">
                      <img
                        src={profileImagePreview}
                        alt="Profile Preview"
                        className="profile-image-edit"
                      />
                      <button
                        type="button"
                        className="remove-image-button"
                        onClick={removeProfileImage}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="dropzone-content">
                      <Upload className="dropzone-icon" />
                      <p className="dropzone-text">
                        {isDragActive ? 'Drop the photo here' : 'Upload Profile Photo'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" onClick={handlePhotoCancel} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="form-submit">Save Photo</button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-details">
              <div className="details-left">
                <div className="profile-info">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt={user?.name}
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-placeholder">
                      <User className="placeholder-icon" />
                    </div>
                  )}
                  <div className="profile-text">
                    <h2 className="profile-name">Dr. {user?.name}</h2>
                    <p className="profile-specialization">{user?.specialization}</p>
                  </div>
                </div>
                <div className="details-list">
                  <div className="detail-item">
                    <Building2 className="detail-icon" />
                    <span>{user?.hospital}</span>
                  </div>
                  <div className="detail-item">
                    <Award className="detail-icon" />
                    <span>{user?.experience} years experience</span>
                  </div>
                </div>
              </div>
              <div className="details-right">
                <div className="detail-item">
                  <Mail className="detail-icon" />
                  <span>{user?.email}</span>
                </div>
                <div className="detail-item">
                  <Phone className="detail-icon" />
                  <span>{user?.phone}</span>
                </div>
                <div className="detail-item detail-bio">
                  <span>{user?.bio || 'No bio provided'}</span>
                </div>
              </div>
            </div>
            {/* Buttons move here for mobile */}
            <div className="mobile-buttons">
              {!isEditingProfile && !isEditingPhoto && (
                <>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="edit-profile-button"
                  >
                    <Edit2 className="edit-icon" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsEditingPhoto(true)}
                    className="edit-photo-button"
                  >
                    <Camera className="edit-icon" />
                    Edit Profile Photo
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}