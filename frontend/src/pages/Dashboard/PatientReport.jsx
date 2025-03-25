import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import './PatientReport.css';

export function PatientReport() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  // Simulated report data (replace with API call in production)
  const reports = {
    '12345': {
      id: '12345',
      name: 'John Smith',
      scanDate: '2025-01-12',
      reportGenerated: '2025-01-13 22:27:40',
      kidneyDetected: 'Yes',
      numberOfStones: 1,
      ctScanImage: null, // Placeholder for CT scan image (replace with actual image URL if available)
      hydronephrosisGrade: 'Grade 2',
      recommendations: 'Consult a nephrologist for treatment options.',
    },
    REG6002: {
      id: 'REG6002',
      name: 'Jane Doe',
      scanDate: '2025-03-14',
      reportGenerated: '2025-03-15 10:00:00',
      kidneyDetected: 'No',
      numberOfStones: 0,
      ctScanImage: null,
      hydronephrosisGrade: 'None',
      recommendations: 'Maintain a healthy diet and follow up in 6 months.',
    },
    REG6003: {
      id: 'REG6003',
      name: 'Mike Johnson',
      scanDate: '2025-03-13',
      reportGenerated: '2025-03-14 09:30:00',
      kidneyDetected: 'Yes',
      numberOfStones: 1,
      ctScanImage: null,
      hydronephrosisGrade: 'Grade 1',
      recommendations: 'Pain management and follow-up in 2 weeks.',
    },
    REG6004: {
      id: 'REG6004',
      name: 'Sarah Williams',
      scanDate: '2025-03-12',
      reportGenerated: '2025-03-13 15:45:00',
      kidneyDetected: 'Yes',
      numberOfStones: 0,
      ctScanImage: null,
      hydronephrosisGrade: 'Inconclusive',
      recommendations: 'Further scans required to confirm diagnosis.',
    },
  };

  const report = reports[patientId] || null;

  // Handle download action (generate PDF)
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Diagno Genix AI Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient ID: ${report.id}`, 20, 30);
    doc.text(`Scan Date: ${report.scanDate}`, 20, 40);
    doc.text(`Report Generated: ${report.reportGenerated}`, 20, 50);
    doc.setFontSize(14);
    doc.text('Findings:', 20, 70);
    doc.setFontSize(12);
    doc.text(`Kidney Detected: ${report.kidneyDetected}`, 20, 80);
    doc.text(`Number of Stones: ${report.numberOfStones}`, 20, 90);
    doc.text(`Hydronephrosis Grade: ${report.hydronephrosisGrade}`, 20, 100);
    doc.setFontSize(14);
    doc.text('Recommendations:', 20, 120);
    doc.setFontSize(12);
    doc.text(report.recommendations, 20, 130, { maxWidth: 170 });
    doc.text('Page 1', 20, 280);
    doc.save(`report-${patientId}.pdf`);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/retrieve');
  };

  if (!report) {
    return (
      <div className="report-container">
        <h2 className="report-title">Patient Report</h2>
        <p className="error-text">Report not found for patient ID: {patientId}</p>
        <button onClick={handleBack} className="back-btn">
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="report-container">
      <h2 className="report-title">Patient Report</h2>
      <div className="report-card neumorphic">
        <div className="report-content">
          <h3 className="report-content-title">Diagno Genix AI Report</h3>
          <div className="report-content-item">
            <span className="label">Patient ID:</span>
            <span>{report.id}</span>
          </div>
          <div className="report-content-item">
            <span className="label">Scan Date:</span>
            <span>{report.scanDate}</span>
          </div>
          <div className="report-content-item">
            <span className="label">Report Generated:</span>
            <span>{report.reportGenerated}</span>
          </div>
          <h4 className="report-subheading">Findings:</h4>
          <div className="report-content-item">
            <span className="label">Kidney Detected:</span>
            <span>{report.kidneyDetected}</span>
          </div>
          <div className="report-content-item">
            <span className="label">Number of Stones:</span>
            <span>{report.numberOfStones}</span>
          </div>
          <div className="report-content-item">
            <span className="label">CT Scan Image:</span>
            <span>
              {report.ctScanImage ? (
                <img src={report.ctScanImage} alt="CT Scan" className="ct-scan-image" />
              ) : (
                'Not Available'
              )}
            </span>
          </div>
          <div className="report-content-item">
            <span className="label">Hydronephrosis Grade:</span>
            <span>{report.hydronephrosisGrade}</span>
          </div>
          <h4 className="report-subheading">Recommendations:</h4>
          <div className="report-content-item">
            <span className="label"></span>
            <span>{report.recommendations}</span>
          </div>
        </div>
        <div className="report-actions">
          <button onClick={handleDownload} className="download-btn">
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </button>
          <button onClick={handleBack} className="back-btn">
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
}