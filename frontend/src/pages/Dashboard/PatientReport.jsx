import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Printer, ZoomIn, ZoomOut } from 'lucide-react';
import './PatientReport.css';

// Use the local Web Worker script
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export function PatientReport() {
  console.log('PatientReport component rendered');

  const { patientId } = useParams();
  const navigate = useNavigate();
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
      pdfUrl: '../../../public/reports/fromMongoDB.pdf',
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
          // Test the PDF URL by fetching it
          console.log('Testing PDF URL:', foundReport.pdfUrl);
          const response = await fetch(foundReport.pdfUrl, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error(`PDF URL is not accessible: ${response.status} ${response.statusText}`);
          }
          console.log('PDF URL is accessible');
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
    if (report.pdfUrl) {
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
      <div className="report-container">
        <h2 className="report-title">Patient Report</h2>
        <p className="loading-text">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    console.log('Rendering error state, error:', error);
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

  console.log('Rendering report view, report:', report);
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



// analyze all my past conversation in this chat about my project then tell our front end is over first analyze and make folder strucuture of all you given codes lets see