import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Award, Mail, Phone, Upload, Edit2, Camera, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false); // For save animation
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
    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
      Object.assign(user, formData);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ profileImage: formData.profileImage });
      toast.success('Profile photo updated successfully');
      setIsEditingPhoto(false);
      Object.assign(user, { profileImage: formData.profileImage });
    } catch (error) {
      toast.error('Failed to update photo');
    } finally {
      setIsLoading(false);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="profile-container"
    >
      <div className="profile-card">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="profile-header"
        >
          <h1 className="profile-title">Doctor Profile</h1>
          <div className="header-buttons desktop-buttons">
            {!isEditingProfile && !isEditingPhoto && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingProfile(true)}
                  className="edit-profile-button"
                >
                  <Edit2 className="edit-icon" />
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingPhoto(true)}
                  className="edit-photo-button"
                >
                  <Camera className="edit-icon" />
                  Edit Profile Photo
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-grid">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="form-group"
              >
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="form-group"
              >
                <label className="form-label">Hospital/Clinic</label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="form-group"
              >
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="form-group"
              >
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="form-group"
              >
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="form-group"
              >
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="form-group"
              >
                <label className="form-label">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="form-input form-textarea"
                  rows="3"
                />
              </motion.div>
            </div>
            <div className="form-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleProfileCancel}
                className="cancel-button"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="form-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="spinner" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </form>
        ) : isEditingPhoto ? (
          <form onSubmit={handlePhotoSubmit} className="profile-form">
            <div className="form-grid">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="form-group"
              >
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
              </motion.div>
            </div>
            <div className="form-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handlePhotoCancel}
                className="cancel-button"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="form-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="spinner" />
                    Saving...
                  </>
                ) : (
                  'Save Photo'
                )}
              </motion.button>
            </div>
          </form>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="profile-details"
            >
              <div className="details-left">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="profile-info"
                >
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
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="details-list"
                >
                  <div className="detail-item">
                    <Building2 className="detail-icon" />
                    <span>{user?.hospital}</span>
                  </div>
                  <div className="detail-item">
                    <Award className="detail-icon" />
                    <span>{user?.experience} years experience</span>
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="details-right"
              >
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
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mobile-buttons"
            >
              {!isEditingProfile && !isEditingPhoto && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditingProfile(true)}
                    className="edit-profile-button"
                  >
                    <Edit2 className="edit-icon" />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditingPhoto(true)}
                    className="edit-photo-button"
                  >
                    <Camera className="edit-icon" />
                    Edit Profile Photo
                  </motion.button>
                </>
              )}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}