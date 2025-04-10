import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './PatientReport.css';

export function PatientReport() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/patient/report/${patientId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const reportData = response.data.patient;
        if (reportData.report) {
          const base64String = reportData.report.split(',')[1];
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } else {
          setError('Report not found');
        }
      } catch (err) {
        setError('Error fetching report: ' + err.message);
        toast.error('Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [patientId]);

  const handleBack = () => {
    navigate('/dashboard/report-retrieve');
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  };

  if (loading) {
    return (
      <div className={`report-container ${isDarkMode ? 'dark' : ''}`}>
        <h2 className="report-title">Patient Report</h2>
        <div className="loading-spinner">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="loading-text">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className={`report-container ${isDarkMode ? 'dark' : ''}`}>
        <h2 className="report-title">Patient Report</h2>
        <p className="error-text">{error || 'Report not found'}</p>
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Search
        </button>
        <button onClick={handleBack} className="mobile-back">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`report-container ${isDarkMode ? 'dark' : ''}`}>
      <button onClick={handleBack} className="back-btn">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Search
      </button>
      <button onClick={handleBack} className="mobile-back">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="report-title">Patient Report</h2>
      <div className="report-card neumorphic">
        <iframe src={pdfUrl} title="Patient Report" className="pdf-viewer" width="100%" height="600px" />
      </div>
    </div>
  );
}