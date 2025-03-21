import React, { useState } from 'react';
import './ReportRetrieve.css';

export function ReportRetrieve() {
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search for:', search);
    // Add API call here to retrieve report
  };

  return (
    <div className="report-container glass">
      <h2 className="report-title">Retrieve Patient Report</h2>
      <form className="report-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="search" className="form-label">Patient Name</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="form-submit hover:bg-blue-700">Search</button>
      </form>
    </div>
  );
}