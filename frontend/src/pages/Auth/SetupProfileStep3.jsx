import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import './SetupProfileStep3.css';
import { useAuth } from '../../context/AuthContext';
import { AnalyzingAnimation } from '../../components/AnalyzingAnimation';

export function SetupProfileStep3() {
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setupProfile, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isVerified) {
      navigate("/otp");
    }
    if (!loading && user) {
      if (!user.hospitalName || !user.specialization) {
        navigate("/setup-profile/step2");
      }
    }
  }, [user, loading, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {};
      if (profileImage) {
        data.profilePhoto = profileImage;
      }
      await setupProfile("3", data);
      toast.success('Profile setup complete!');
    } catch (error) {
      toast.error(error.message || 'Failed to setup profile');
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await setupProfile("3", {});
      toast.success('Profile setup complete!');
    } catch (error) {
      toast.error(error.message || 'Failed to setup profile');
      setIsLoading(false);
    }
  };

  // if (loading) {
  //   return <AnalyzingAnimation/>;
  // }

  return (
    <div className="setup-step3-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="setup-step3-container glass"
      >
        <h2 className="setup-step3-title">Add Your Profile Photo</h2>
        <form className="setup-step3-form" onSubmit={handleSubmit}>
          <motion.div 
            className="profile-picture-container"
            whileHover={{ scale: 1.1 }}
          >
            {preview ? (
              <img src={preview} alt="Profile Preview" className="profile-picture" />
            ) : (
              <motion.div {...getRootProps()} className="dropzone" whileHover={{ scale: 1.05 }}>
                <input {...getInputProps()} />
                <Upload className="dropzone-icon" />
                <p>{isDragActive ? 'Drop the file here' : 'Upload Profile Picture'}</p>
              </motion.div>
            )}
          </motion.div>

          <div className="button-group">
            <motion.button 
              type="button" 
              className="back-button" 
              onClick={() => navigate('/setup-profile/step2')}
              whileHover={{ scale: 1.1 }}
            >
              Back
            </motion.button>
            <motion.button 
              type="button" 
              className="skip-button" 
              onClick={handleSkip}
              disabled={isLoading}
              whileHover={{ scale: 1.1 }}
            >
              {isLoading ? 'Skipping...' : 'Skip'}
            </motion.button>
            <motion.button 
              type="submit" 
              className="save-button" 
              disabled={isLoading}
              whileHover={{ scale: 1.1 }}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}