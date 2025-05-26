import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AnalyzingAnimation } from '../../components/AnalyzingAnimation';
import { useAuth } from '../../context/AuthContext';
import './Upload.css';

export function Upload() {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [date, setDate] = useState('');
  const [ctScan, setCtScan] = useState(null);
  const [ctScanUrl, setCtScanUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { upload, isDarkMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setCtScan(acceptedFiles[0]),
  });

  useEffect(() => {
    if (ctScan) {
      const url = URL.createObjectURL(ctScan);
      setCtScanUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCtScanUrl(null);
    }
  }, [ctScan]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientName || !patientId || !age || !gender || !date || !ctScan) {
      toast.error('Please fill all fields and upload a CT scan');
      return;
    }

    setIsLoading(true);

    try {
      const response = await upload({ patientName, patientId, age, gender, date, ctScan });
      console.log("HandleSubmit response:", response);
      setIsLoading(false);
      setIsAnalyzing(true);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate analysis
      setIsAnalyzing(false);
      navigate('/dashboard/report-generated', {
        state: {
          patientId: response.patientId,
          patientName: response.patientName,
          ctScan: response.ctScan,
          overlay: response.overlay || null, // Null if no stone detected
          report: response.report
        }
      });
    } catch (error) {
      console.error("HandleSubmit error:", error);
      toast.error('Upload failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (isAnalyzing) {
    return <AnalyzingAnimation />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`upload-container glass ${isDarkMode ? 'dark-mode' : ''}`}
    >
      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="upload-title"
      >
        Upload Patient Details
      </motion.h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-sections">
          <div className="patient-details">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="form-group">
              <label htmlFor="patientName" className="form-label">Patient Name</label>
              <input id="patientName" type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="form-input" />
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="form-group">
              <label htmlFor="patientId" className="form-label">Patient ID</label>
              <input id="patientId" type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="form-input" />
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="form-group">
              <label htmlFor="age" className="form-label">Age</label>
              <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="form-input" />
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="form-group">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="form-input">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="form-group">
              <label htmlFor="date" className="form-label">Date</label>
              <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" disabled />
            </motion.div>
          </div>
          <div className="ct-scan-section">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="form-group dropzone-group">
              <label className="form-label">CT Scan</label>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {ctScanUrl ? (
                  <div className="dropzone-image-container">
                    <img src={ctScanUrl} alt="Uploaded CT Scan" className="dropzone-image" />
                    <button className="remove-image-button" onClick={(e) => { e.stopPropagation(); setCtScan(null); }}>×</button>
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <UploadIcon className="dropzone-icon" />
                    <label className="dropzone-label">{isDragActive ? 'Drop here' : 'Upload CT Scan'}</label>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="form-submit"
              disabled={isLoading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}