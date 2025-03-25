import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Printer, ZoomIn, ZoomOut } from 'lucide-react';
import './PatientReport.css';

// Set up the worker for react-pdf (using a CDN for simplicity)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PatientReport() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0); // For zoom functionality
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulated report data with PDF URL (replace with API call to MongoDB in production)
  const reports = {
    '12345': {
      id: '12345',
      name: 'John Smith',
      pdfUrl: 'http://example.com/reports/12345.pdf', // Placeholder for PDF URL
    },
    REG6002: {
      id: 'REG6002',
      name: 'Jane Doe',
      pdfUrl: 'http://example.com/reports/REG6002.pdf',
    },
    REG6003: {
      id: 'REG6003',
      name: 'Mike Johnson',
      pdfUrl: 'http://example.com/reports/REG6003.pdf',
    },
    REG6004: {
      id: 'REG6004',
      name: 'Sarah Williams',
      pdfUrl: 'http://example.com/reports/REG6004.pdf',
    },
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        // Simulate API call to fetch report
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const foundReport = reports[patientId];
        if (foundReport) {
          setReport(foundReport);
        } else {
          setError('Report not found for patient ID: ' + patientId);
        }
      } catch (err) {
        setError('Error fetching report');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }

      // Example API call (uncomment and adjust when backend is ready):
      /*
      try {
        const response = await fetch(`/api/reports/${patientId}`);
        const data = await response.json();
        if (data.report) {
          setReport(data.report);
        } else {
          setError('Report not found for patient ID: ' + patientId);
        }
      } catch (err) {
        setError('Error fetching report');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
      */
    };
    fetchReport();
  }, [patientId]);

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Handle download action
  const handleDownload = () => {
    if (report.pdfUrl) {
      const link = document.createElement('a');
      link.href = report.pdfUrl;
      link.download = `report-${patientId}.pdf`;
      link.click();
    } else {
      console.log('PDF URL not available');
    }
  };

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  // Handle zoom actions
  const zoomIn = () => setScale(scale + 0.1);
  const zoomOut = () => setScale(scale > 0.5 ? scale - 0.1 : scale);

  // Handle back navigation
  const handleBack = () => {
    navigate('/dashboard/report-retrieve');
  };

  // Handle page navigation
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
    return (
      <div className="report-container">
        <h2 className="report-title">Patient Report</h2>
        <p className="loading-text">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="report-container">
        <h2 className="report-title">Patient Report</h2>
        <p className="error-text">{error || 'Report not found'}</p>
        <button onClick={handleBack} className="back-btn">
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="report-container">
      <h2 className="report-title">Patient Report - {report.name}</h2>
      <div className="report-card neumorphic">
        <div className="pdf-viewer">
          <Document
            file={report.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error('Error loading PDF:', error);
              setError('Failed to load PDF');
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
              Page {pageNumber} of {numPages}
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