import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './SetupProfile.css';

export function SetupProfile() {
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [hospital, setHospital] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
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
    try {
      await updateProfile({
        specialization,
        experience: parseInt(experience),
        hospital,
        profileImage,
      });
      toast.success('Profile setup complete!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to setup profile');
    }
  };

  return (
    <div className="setup-profile-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="setup-profile-container glass"
      >
        <h2 className="setup-profile-title">
          Complete Your Profile
        </h2>
        <form className="setup-profile-form" onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label htmlFor="specialization" className="form-label">
              Specialization
            </label>
            <input
              id="specialization"
              type="text"
              required
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="form-input focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience" className="form-label">
              Years of Experience
            </label>
            <input
              id="experience"
              type="number"
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="form-input focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hospital" className="form-label">
              Hospital/Clinic
            </label>
            <input
              id="hospital"
              type="text"
              required
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="form-input focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="form-submit hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Complete Setup
          </button>
        </form>
      </motion.div>
    </div>
  );
}