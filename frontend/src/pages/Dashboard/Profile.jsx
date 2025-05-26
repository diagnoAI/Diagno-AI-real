import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Award, Mail, Phone, Upload, Edit2, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Profile.css';

export function Profile() {
  const { user, logout, setupProfile, loading } = useAuth();
  const navigate = useNavigate();

  // Wait for loading to complete
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="profile-container"
      >
        <p>Loading...</p>
      </motion.div>
    );
  }

  // Redirect if no user
  useEffect(() => {
    if (!user && !loading) {
      console.log('No user data - redirecting to login');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (!user) {
    return null;
  }

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    specialization: user?.specialization || '',
    hospitalName: user?.hospitalName || '',
    yearsOfExperience: user?.yearsOfExperience || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePhoto: null,
    bio: user?.bio || '',
    age: user?.age || 0,
    gender: user?.gender || '',
  });
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profilePhoto || '/default-profile.png');

  useEffect(() => {
    if (formData.profilePhoto instanceof File) {
      console.log('Profile photo updated:', {
        name: formData.profilePhoto.name,
        size: formData.profilePhoto.size,
        type: formData.profilePhoto.type,
      });
      const url = URL.createObjectURL(formData.profilePhoto);
      setProfileImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      console.log('Resetting preview to user profile photo or default');
      setProfileImagePreview(user?.profilePhoto || '/default-profile.png');
    }
  }, [formData.profilePhoto, user?.profilePhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }, // Restrict to common image types
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB limit
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection) => {
          rejection.errors.forEach((error) => {
            console.error('Drop rejected:', error.message);
            toast.error(`File error: ${error.message}`);
          });
        });
        return;
      }
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log('File accepted:', {
          name: file.name,
          size: file.size,
          type: file.type,
        });
        setFormData((prev) => ({ ...prev, profilePhoto: file }));
      }
    },
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updates = {
        step: "update",
        fullName: formData.fullName,
        hospitalName: formData.hospitalName,
        specialization: formData.specialization,
        yearsOfExperience: formData.yearsOfExperience,
        phone: formData.phone,
        bio: formData.bio,
        age: formData.age,
        gender: formData.gender,
      };
      await setupProfile("update", updates);
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Profile submit error:', error);
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profilePhoto || !(formData.profilePhoto instanceof File)) {
      console.warn('No valid profile photo selected');
      toast.error('Please select a valid image file');
      return;
    }

    console.log('Submitting profile photo:', {
      name: formData.profilePhoto.name,
      size: formData.profilePhoto.size,
      type: formData.profilePhoto.type,
    });

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('step', '3');
      formDataToSend.append('profilePhoto', formData.profilePhoto);

      // Log FormData contents
      console.log('FormData prepared for submission:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.size} bytes, ${value.type})` : value);
      }

      await setupProfile('3', formDataToSend);
      console.log('Profile photo upload successful');
      toast.success('Profile photo updated successfully');
      setIsEditingPhoto(false);
      setFormData((prev) => ({ ...prev, profilePhoto: null }));
      setProfileImagePreview(user?.profilePhoto || '/default-profile.png');
    } catch (error) {
      console.error('Photo submit error:', error);
      toast.error('Failed to update photo: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileCancel = () => {
    console.log('Cancel profile edit');
    setIsEditingProfile(false);
    setFormData({
      fullName: user?.fullName || '',
      specialization: user?.specialization || '',
      hospitalName: user?.hospitalName || '',
      yearsOfExperience: user?.yearsOfExperience || '',
      email: user?.email || '',
      phone: user?.phone || '',
      profilePhoto: null,
      bio: user?.bio || '',
      age: user?.age || 0,
      gender: user?.gender || '',
    });
    setProfileImagePreview(user?.profilePhoto || '/default-profile.png');
  };

  const handlePhotoCancel = () => {
    console.log('Cancel photo edit');
    setIsEditingPhoto(false);
    setFormData((prev) => ({ ...prev, profilePhoto: null }));
    setProfileImagePreview(user?.profilePhoto || '/default-profile.png');
  };

  const removeProfileImage = (e) => {
    e.stopPropagation();
    console.log('Removing profile image preview');
    setFormData((prev) => ({ ...prev, profilePhoto: null }));
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
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="form-group"
              >
                <label className="form-label">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="form-group"
              >
                <label className="form-label">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="form-group"
              >
                <label className="form-label">Hospital/Clinic</label>
                <input
                  type="text"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
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
                transition={{ delay: 0.6 }}
                className="form-group"
              >
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="form-input"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="form-group"
              >
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  disabled
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
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
                transition={{ delay: 0.9 }}
                className="form-group"
              >
                <label className="form-label">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="form-input form-textarea"
                  rows="2"
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
                        {isDragActive ? 'Drop here' : 'Upload Photo'}
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
                disabled={isLoading || !formData.profilePhoto}
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
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName}
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-placeholder">
                      <User className="placeholder-icon" />
                    </div>
                  )}
                  <div className="profile-text">
                    <h2 className="profile-name">Dr. {user.fullName}</h2>
                    <p className="profile-specialization">{user.specialization}</p>
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
                    <span>{user.hospitalName}</span>
                  </div>
                  <div className="detail-item">
                    <Award className="detail-icon" />
                    <span>{user.yearsOfExperience} years</span>
                  </div>
                  <div className="detail-item">
                    <User className="detail-icon" />
                    <span>Age: {user.age || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <User className="detail-icon" />
                    <span>Gender: {user.gender || 'Not provided'}</span>
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
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <Phone className="detail-icon" />
                  <span>{user.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item detail-bio">
                  <span>{user.bio || 'No bio'}</span>
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