import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Trash2, Eye } from 'lucide-react';
import './ReportRetrieve.css';

export function ReportRetrieve() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  // Simulated patient data (replace with API call in production)
  const patients = [
    { id: '12345', name: 'John Smith', date: '2025-01-12', status: 'Completed' },
    { id: 'REG6002', name: 'Jane Doe', date: '2025-03-14', status: 'Pending' },
    { id: 'REG6003', name: 'Mike Johnson', date: '2025-03-13', status: 'Completed' },
    { id: 'REG6004', name: 'Sarah Williams', date: '2025-03-12', status: 'In Progress' },
  ];

  // Handle search input change (for autocomplete suggestions)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(value.toLowerCase()) ||
        patient.id.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  // Handle suggestion click
  const handleSuggestionClick = (patient) => {
    setSearch(patient.name);
    setSuggestions([]);
    setSelectedPatient(patient);
  };

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const foundPatient = patients.find(
      (patient) =>
        patient.name.toLowerCase() === search.toLowerCase() ||
        patient.id.toLowerCase() === search.toLowerCase()
    );
    setSelectedPatient(foundPatient || null);
    setSuggestions([]);
  };

  // Handle download action (placeholder)
  const handleDownload = (patientId) => {
    console.log(`Downloading report for patient ID: ${patientId}`);
    // Add API call to download report
  };

  // Handle delete action (placeholder)
  const handleDelete = (patientId) => {
    console.log(`Deleting report for patient ID: ${patientId}`);
    setSelectedPatient(null);
  };

  // Handle view action
  const handleView = (patientId) => {
    navigate(`/report/${patientId}`);
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Patient Records</h2>
      <form className="report-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="search" className="form-label">
            Search Patients
          </label>
          <div className="search-bar-container">
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="form-input neumorphic-input"
              placeholder="Enter patient name or ID..."
            />
            <button type="submit" className="search-icon-btn">
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list neumorphic">
              {suggestions.map((patient) => (
                <li
                  key={patient.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(patient)}
                >
                  <span className="font-medium">{patient.name}</span> ({patient.id})
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      {/* Patient Records Table */}
      {selectedPatient && (
        <div className="patient-records-section">
          <h3 className="section-title">Patient Details</h3>
          <div className="patient-records-table neumorphic">
            <div className="table-header">
              <span>Name</span>
              <span>Reg. No</span>
              <span>Date</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="table-row">
              <span>{selectedPatient.name}</span>
              <span>{selectedPatient.id}</span>
              <span>{selectedPatient.date}</span>
              <span className={`status ${selectedPatient.status.toLowerCase()}`}>
                {selectedPatient.status}
              </span>
              <div className="actions">
                <button
                  onClick={() => handleView(selectedPatient.id)}
                  className="action-btn view"
                  title="View Report"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownload(selectedPatient.id)}
                  className="action-btn download"
                  title="Download Report"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(selectedPatient.id)}
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