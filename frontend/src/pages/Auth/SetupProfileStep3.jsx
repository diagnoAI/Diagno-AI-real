import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './SetupProfileStep3.css';

export function SetupProfileStep3() {
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { updateProfile } = useAuth();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setProfileImage(acceptedFiles[0]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({
        name: state.name,
        hospital: state.hospital,
        profileImage: profileImage ? URL.createObjectURL(profileImage) : null,
      });
      toast.success('Profile setup complete!');
      navigate('/'); // Redirect to Landing page
    } catch (error) {
      toast.error('Failed to setup profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="setup-step3-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="setup-step3-container glass"
      >
        <h2 className="setup-step3-title">Upload Profile Photo</h2>
        <form className="setup-step3-form" onSubmit={handleSubmit}>
          <div
            {...getRootProps()}
            className="dropzone hover:border-blue-500"
          >
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <Upload className="dropzone-icon" />
              <div className="dropzone-text">
                <label className="dropzone-label hover:text-blue-500">
                  {isDragActive ? 'Drop the file here' : 'Upload a profile photo'}
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="form-submit hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Complete Setup'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}