import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Trash2, Eye, X } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ReportRetrieve.css';

export function ReportRetrieve() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patient, setPatient] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useAuth();

  useEffect(() => {
    const fetchAllReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/patient/report-generated', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAllReports(response.data.reports);
      } catch (err) {
        toast.error('Failed to load patient reports');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = allReports.filter(
        (report) =>
          report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.patientId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allReports]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setError('');
    setPatient(null);
  };

  const handleSuggestionClick = (report) => {
    setSearchQuery(report.patientName);
    setPatient(report);
    setSuggestions([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setPatient(null);
    setLoading(true);

    const foundPatient = allReports.find(
      (p) =>
        p.patientName.toLowerCase() === searchQuery.toLowerCase() ||
        p.patientId.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundPatient) {
      setPatient(foundPatient);
      toast.success('Patient record found!');
    } else {
      setError('No patient found with this name or ID');
      toast.error('Patient not found');
    }
    setLoading(false);
    setSuggestions([]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPatient(null);
    setError('');
    setSuggestions([]);
  };

  const handleView = (patientId) => {
    navigate(`/dashboard/report/${patientId}`);
  };

  const handleDownload = async (patientId) => {
    const toastId = toast.loading('Downloading report...');
    try {
      const response = await axios.get(`http://localhost:5000/patient/report/${patientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const reportBase64 = response.data.patient.report;
      if (!reportBase64) throw new Error('Report not found');

      const base64String = reportBase64.split(',')[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${patientId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report', { id: toastId });
    }
  };

  const handleDelete = async (patientId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this patient record? This action cannot be undone.');
    if (!confirmDelete) return;

    const toastId = toast.loading('Deleting patient record...');
    try {
      await axios.delete(`http://localhost:5000/patient/delete-patient/${patientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPatient(null);
      setAllReports(allReports.filter((report) => report.id !== patientId));
      toast.success('Patient record deleted successfully!', { id: toastId });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete patient record', { id: toastId });
    }
  };

  return (
    <motion.div
      className={`report-retrieve-container ${isDarkMode ? 'dark-mode' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="report-title">Search Patient Records</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="search" className="form-label">
            Search by Patient Name or ID
          </label>
          <div className="search-bar-container">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-input neumorphic-input"
              placeholder="Enter patient name or ID..."
            />
            <button type="submit" className="search-btn" disabled={loading}>
              <Search className="h-5 w-5 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </button>
            {searchQuery && (
              <button type="button" onClick={handleClearSearch} className="clear-btn" title="Clear Search">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((report) => (
                <li
                  key={report.id}
                  onClick={() => handleSuggestionClick(report)}
                  className="suggestion-item"
                >
                  {report.patientName} ({report.patientId})
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      {loading && <p className="loading-text">Loading...</p>}
      {!loading && error && <p className="error-text">{error}</p>}
      {!loading && patient && (
        <motion.div
          className="patient-details-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="section-title">Patient Details</h3>
          <div className="patient-table neumorphic">
            <div className="table-header">
              <span>Name</span>
              <span>Reg. No</span>
              <span>Date</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="table-row">
              <span>{patient.patientName}</span>
              <span>{patient.patientId}</span>
              <span>{new Date(patient.date).toLocaleDateString()}</span>
              <span className={`status ${patient.hasStone ? 'completed' : 'pending'}`}>
                {patient.hasStone ? 'Stone Detected' : 'No Stone'}
              </span>
              <div className="actions">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleView(patient.id)}
                  className="action-btn view"
                  title="View Report"
                >
                  <Eye className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(patient.id)}
                  className="action-btn download"
                  title="Download Report"
                >
                  <Download className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(patient.id)}
                  className="action-btn delete"
                  title="Delete Report"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}