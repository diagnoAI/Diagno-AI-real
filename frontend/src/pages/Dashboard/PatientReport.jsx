import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Printer, ZoomIn, ZoomOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './PatientReport.css';

// Dynamically set the workerSrc using pdfjs-dist
import * as pdfjsLib from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
// Alternatively, if you prefer to use the local file, ensure it's in public:
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export function PatientReport() {
  console.log('PatientReport component rendered');

  const { patientId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useAuth();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  console.log('Patient ID from useParams:', patientId);

  const reports = {
    '12345': {
      id: '12345',
      name: 'John Smith',
      pdfUrl: '/reports/fromMongoDB.pdf',
    },
    REG6002: {
      id: 'REG6002',
      name: 'Jane Doe',
      pdfUrl: '/reports/sample.pdf',
    },
    REG6003: {
      id: 'REG6003',
      name: 'Mike Johnson',
      pdfUrl: '/reports/sample.pdf',
    },
    REG6004: {
      id: 'REG6004',
      name: 'Sarah Williams',
      pdfUrl: '/reports/sample.pdf',
    },
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        console.log('Fetching report for patient ID:', patientId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const foundReport = reports[patientId];
        console.log('Found report:', foundReport);
        if (foundReport) {
          setReport(foundReport);
        } else {
          setError('Report not found for patient ID: ' + patientId);
        }
      } catch (err) {
        setError('Error fetching report: ' + err.message);
        console.error('Error in fetchReport:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [patientId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully, number of pages:', numPages);
    setNumPages(numPages);
  };

  const handleDownload = () => {
    if (report?.pdfUrl) {
      console.log('Downloading PDF from URL:', report.pdfUrl);
      const link = document.createElement('a');
      link.href = report.pdfUrl;
      link.download = `report-${patientId}.pdf`;
      link.click();
    } else {
      console.log('PDF URL not available');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const zoomIn = () => setScale(scale + 0.1);
  const zoomOut = () => setScale(scale > 0.5 ? scale - 0.1 : scale);

  const handleBack = () => {
    console.log('Back to Search button clicked');
    console.log('Navigating to /dashboard/report-retrieve');
    try {
      navigate('/dashboard/report-retrieve');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className={`report-container ${isDarkMode ? 'dark' : ''}`}>
        <h2 className="report-title">Patient Report</h2>
        <div className="loading-spinner">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="loading-text">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    console.log('Rendering error state, error:', error);
    return (
      <div className={`report-container ${isDarkMode ? 'dark' : ''}`}>
        <h2 className="report-title">Patient Report</h2>
        <p className="error-text">{error || 'Report not found'}</p>
        <button onClick={handleBack} className="back-btn">
          Back to Search
        </button>
      </div>
    );
  }

  console.log('Rendering report view, report:', report);
  return (
    <div className={`report-container ${isDarkMode ? 'dark' : ''}`}>
      <h2 className="report-title">Patient Report - {report.name}</h2>
      <div className="report-card neumorphic">
        <div className="pdf-viewer">
          <Document
            file={report.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error('Error loading PDF:', error);
              setError('Failed to load PDF: ' + error.message);
            }}
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
          <div className="pdf-navigation">
            <button
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className="nav-btn"
            >
              Previous
            </button>
            <p>
              Page {pageNumber} of {numPages || '...'}{' '}
              {numPages ? '' : '(Loading pages)'}
            </p>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="nav-btn"
            >
              Next
            </button>
            <button onClick={zoomOut} className="nav-btn">
              <ZoomOut className="h-4 w-4 mr-1" />
              Zoom Out
            </button>
            <button onClick={zoomIn} className="nav-btn">
              <ZoomIn className="h-4 w-4 mr-1" />
              Zoom In
            </button>
          </div>
        </div>
        <div className="report-actions">
          <button onClick={handleDownload} className="download-btn">
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </button>
          <button onClick={handlePrint} className="download-btn">
            <Printer className="h-5 w-5 mr-2" />
            Print Report
          </button>
          <button onClick={handleBack} className="back-btn">
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
}