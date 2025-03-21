import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { AnalyzingAnimation } from '../../components/AnalyzingAnimation';
import './Upload.css';

export function Upload() {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [date, setDate] = useState('');
  const [ctScan, setCtScan] = useState(null);
  const [ctScanUrl, setCtScanUrl] = useState(null); // New state for image URL
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setCtScan(acceptedFiles[0]),
  });

  // Generate and clean up the image URL
  useEffect(() => {
    if (ctScan) {
      const url = URL.createObjectURL(ctScan);
      setCtScanUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
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
      // Simulate uploading to backend
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsAnalyzing(true);
      // Simulate analysis time
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsAnalyzing(false);
      navigate('/dashboard/report-generated');
    } catch (error) {
      toast.error('Upload failed');
      setIsLoading(false);
    }
  };

  // Show animation when analyzing
  if (isAnalyzing) {
    return <AnalyzingAnimation />;
  }

  return (
    <div className="upload-container glass">
      <h2 className="upload-title">Upload Patient Details</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientName" className="form-label">Patient Name</label>
          <input
            id="patientName"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="patientId" className="form-label">Patient ID</label>
          <input
            id="patientId"
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="age" className="form-label">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="form-input"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {ctScanUrl ? (
            <div className="dropzone-image-container">
              <img src={ctScanUrl} alt="Uploaded CT Scan" className="dropzone-image" />
              <button
                className="remove-image-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCtScan(null);
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div className="dropzone-content">
              <UploadIcon className="dropzone-icon" />
              <label className="dropzone-label">
                {isDragActive ? 'Drop the file here' : 'Upload CT Scan'}
              </label>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="form-submit"
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}