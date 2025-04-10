import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Eye, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './ReportGenerated.css';

export function ReportGenerated() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingReport, setViewingReport] = useState(false);

  useEffect(() => {
    if (!state?.patientId || !state?.ctScan || !state?.report) {
      toast.error('Missing required data. Please upload a scan first.');
      navigate('/dashboard/upload');
      return;
    }

    setReportData({
      patientId: state.patientId,
      patientName: state.patientName,
      ctScan: state.ctScan,
      overlay: state.overlay || null,
      report: state.report
    });
    setLoading(false);
  }, [state, navigate]);

  const handleDownload = () => {
    if (reportData?.report) {
      try {
        const base64String = reportData.report.split(',')[1];
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
        link.download = `report_${reportData.patientId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Report downloaded successfully!');
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download report');
      }
    }
  };

  const handleView = () => setViewingReport(true);
  const handleBack = () => setViewingReport(false);

  if (loading) {
    return (
      <div className="report-generated-container glass">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="report-title">
          Loading Report...
        </motion.h2>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="report-generated-container glass">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="report-title">
          Report Not Found
        </motion.h2>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/dashboard/upload')} className="action-btn">
          Back to Upload
        </motion.button>
      </div>
    );
  }

  if (viewingReport) {
    return (
      <div className="report-viewer-full glass">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="report-full-container">
          <button onClick={handleBack} className="back-btn">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <iframe src={reportData.report} title="Report PDF" className="report-iframe" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="report-generated-container glass">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="report-title">
        Report Generated
      </motion.h2>
      {reportData.overlay ? (
        <div className="image-container">
          <div className="image-section">
            <h3 className="image-label">Input CT Scan</h3>
            <img src={reportData.ctScan} alt="CT Scan" className="report-image" />
          </div>
          <div className="image-section">
            <h3 className="image-label">Overlay Image</h3>
            <img src={reportData.overlay} alt="Overlay" className="report-image" />
          </div>
        </div>
      ) : (
        <div className="single-image-container">
          <img src={reportData.ctScan} alt="CT Scan" className="report-image-centered" />
        </div>
      )}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="report-message"
      >
        {reportData.overlay ? 'Stone detected' : 'Stone not detected'}
      </motion.p>
      <div className="action-buttons">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleView} className="action-btn view-btn">
          <Eye className="w-5 h-5 mr-2" /> View the report
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDownload} className="action-btn download-btn">
          <Download className="w-5 h-5 mr-2" /> Download the report
        </motion.button>
      </div>
    </div>
  );
}