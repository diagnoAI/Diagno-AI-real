import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Trash2, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './ReportRetrieve.css';

export function ReportRetrieve() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simulated patient data (replace with API call to MongoDB in production)
  const patients = [
    { id: '12345', name: 'John Smith', date: '2025-01-12', status: 'Completed' },
    { id: 'REG6002', name: 'Jane Doe', date: '2025-03-14', status: 'Pending' },
    { id: 'REG6003', name: 'Mike Johnson', date: '2025-03-13', status: 'Completed' },
    { id: 'REG6004', name: 'Sarah Williams', date: '2025-03-12', status: 'In Progress' },
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setError(''); // Clear error when typing
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setPatient(null);
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const foundPatient = patients.find(
        (p) =>
          p.name.toLowerCase() === searchQuery.toLowerCase() ||
          p.id.toLowerCase() === searchQuery.toLowerCase()
      );

      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        setError('Invalid patient name or ID');
      }
    } catch (err) {
      setError('Error searching for patient');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setPatient(null);
    setError('');
  };

  // Handle view action
  const handleView = (patientId) => {
    console.log(`Attempting to navigate to /dashboard/report/${patientId}`); // Debug log
    navigate(`/dashboard/report/${patientId}`);
  };

  // Handle download action
  const handleDownload = async (patientId) => {
    toast.loading('Downloading report...');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Downloading report for patient ID: ${patientId}`);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  // Handle delete action with confirmation
  const handleDelete = async (patientId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this report? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    toast.loading('Deleting report...');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPatient(null);
      toast.success('Report deleted successfully!');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  return (
    <div className="report-retrieve-container">
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
              <button
                type="button"
                onClick={handleClearSearch}
                className="clear-btn"
                title="Clear Search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </form>

      {loading && <p className="loading-text">Loading...</p>}
      {!loading && error && <p className="error-text">{error}</p>}
      {!loading && patient && (
        <div className="patient-details-section">
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
              <span>{patient.name}</span>
              <span>{patient.id}</span>
              <span>{patient.date}</span>
              <span className={`status ${patient.status.toLowerCase()}`}>
                {patient.status}
              </span>
              <div className="actions">
                <button
                  onClick={() => handleView(patient.id)}
                  className="action-btn view"
                  title="View Report"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownload(patient.id)}
                  className="action-btn download"
                  title="Download Report"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="action-btn delete"
                  title="Delete Report"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}