import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import toast from 'react-hot-toast';
import './SetupProfileStep3.css';

export function SetupProfileStep3() {
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setProfileImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview first
    },
  });

  const onCropComplete = useCallback(async (_, croppedAreaPixels) => {
    const cropped = await getCroppedImg(preview, croppedAreaPixels);
    setCroppedImage(cropped);
  }, [preview]);

  const handleCropConfirm = () => {
    setIsCropping(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      toast.success('Profile setup complete!');
      navigate('/login');
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
          
          {/* Profile Picture Preview */}
          <motion.div 
            className="profile-picture-container"
            whileHover={{ scale: 1.1 }}
          >
            {croppedImage ? (
              <img src={croppedImage} alt="Profile Preview" className="profile-picture" />
            ) : preview ? (
              <img src={preview} alt="Profile Preview" className="profile-picture" />
            ) : (
              <motion.div {...getRootProps()} className="dropzone" whileHover={{ scale: 1.05 }}>
                <input {...getInputProps()} />
                <Upload className="dropzone-icon" />
                <p>{isDragActive ? 'Drop the file here' : 'Upload Profile Picture'}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Crop Button */}
          {preview && (
            <motion.button 
              type="button" 
              className="crop-button" 
              onClick={() => setIsCropping(true)}
              whileHover={{ scale: 1.1 }}
            >
              Crop Photo
            </motion.button>
          )}

          {/* Cropping Modal */}
          {isCropping && (
            <div className="crop-modal">
              <div className="crop-container">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="round" // Circular crop
                  showGrid={false} // Hide grid for clean UI
                />
              </div>
              <div className="crop-controls">
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.1" 
                  value={zoom} 
                  onChange={(e) => setZoom(e.target.value)}
                />
                <motion.button 
                  className="ok-button" 
                  onClick={handleCropConfirm}
                  whileHover={{ scale: 1.1 }}
                >
                  OK
                </motion.button>
              </div>
            </div>
          )}

          {/* Back & Save Buttons */}
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
