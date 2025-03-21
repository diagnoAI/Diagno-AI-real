import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import './Profile.css';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [hospital, setHospital] = useState(user?.hospital || '');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImage || '');

  useEffect(() => {
    if (profileImage) {
      const url = URL.createObjectURL(profileImage);
      setProfileImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setProfileImageUrl(user?.profileImage || '/default-profile.png');
    }
  }, [profileImage, user?.profileImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setProfileImage(acceptedFiles[0]),
  });

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, hospital, profileImage: user?.profileImage });
      toast.success('Profile details updated!');
      setIsEditingDetails(false);
    } catch (error) {
      toast.error('Failed to update profile details');
    }
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      toast.error('Please upload a new photo');
      return;
    }
    try {
      await updateProfile({ name: user?.name, hospital: user?.hospital, profileImage });
      toast.success('Profile photo updated!');
      setIsEditingPhoto(false);
      setProfileImage(null);
    } catch (error) {
      toast.error('Failed to update profile photo');
    }
  };

  const handleCancel = () => {
    setIsEditingDetails(false);
    setIsEditingPhoto(false);
    setName(user?.name || '');
    setHospital(user?.hospital || '');
    setProfileImage(null);
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Doctor Profile</h2>
      {isEditingDetails ? (
        <form className="profile-form" onSubmit={handleSaveDetails}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hospital" className="form-label">Hospital/Clinic</label>
            <input
              id="hospital"
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="form-submit hover:bg-blue-700">Save</button>
            <button type="button" className="form-cancel hover:bg-gray-100" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : isEditingPhoto ? (
        <form className="profile-form" onSubmit={handleSavePhoto}>
          <div className="form-group">
            <label className="form-label">Profile Photo</label>
            <div {...getRootProps()} className="profile-dropzone">
              <input {...getInputProps()} />
              {profileImageUrl ? (
                <div className="profile-image-preview">
                  <img src={profileImageUrl} alt="Profile Preview" className="profile-image-edit" />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileImage(null);
                    }}
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
          <div className="button-group">
            <button type="submit" className="form-submit hover:bg-blue-700">Save</button>
            <button type="button" className="form-cancel hover:bg-gray-100" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <img
            src={user?.profileImage || '/default-profile.png'}
            alt={user?.name}
            className="profile-image"
          />
          <p className="profile-text"><strong>Name:</strong> Dr. {user?.name}</p>
          <p className="profile-text"><strong>Hospital/Clinic:</strong> {user?.hospital}</p>
          <div className="button-group">
            <button
              className="form-submit hover:bg-blue-700"
              onClick={() => setIsEditingDetails(true)}
            >
              Edit Profile
            </button>
            <button
              className="form-submit hover:bg-blue-700"
              onClick={() => setIsEditingPhoto(true)}
            >
              Edit Profile Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}