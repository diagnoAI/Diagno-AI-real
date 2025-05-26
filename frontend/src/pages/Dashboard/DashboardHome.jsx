import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Activity, HeartPulse, Stethoscope } from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import './DashboardHome.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Slider Component
const Slider = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider-container">
      <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {images.map((img, index) => (
          <div key={index} className="slide">
            {img ? <img src={img} alt={`Slide ${index + 1}`} className="slide-image" /> : <div className="slide-placeholder">Add Image {index + 1}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export function DashboardHome() {
  const { user, isDarkMode, fetchStats, loading } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    scansToday: 0,
    highRiskPatients: 0,
    detectionAccuracy: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({ Low: 0, Medium: 0, High: 0 });
  const [trendData, setTrendData] = useState([0, 0, 0, 0, 0, 0, 0]);

  // Fetch initial stats
  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchStats();
      if (data) {
        setStats({
          totalPatients: data.stats.totalPatients,
          scansToday: data.stats.scansToday,
          highRiskPatients: data.stats.highRiskPatients,
          detectionAccuracy: data.stats.detectionAccuracy,
        });
        setRecentActivity(data.recentActivity);
        setRiskDistribution(data.riskDistribution);
        setTrendData(data.trendData);
      }
    };
    if (!loading && user) {
      loadStats();
    }
  }, [fetchStats, loading, user]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats().then((data) => {
        if (data) {
          setStats((prev) => ({
            ...prev,
            totalPatients: data.stats.totalPatients,
            scansToday: data.stats.scansToday,
            highRiskPatients: data.stats.highRiskPatients,
            detectionAccuracy: data.stats.detectionAccuracy,
          }));
          setRecentActivity(data.recentActivity);
          setRiskDistribution(data.riskDistribution);
          setTrendData(data.trendData);
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
    hover: { y: -5, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  // Graph data
  const graphData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Kidney Stone Scans',
        data: trendData,
        borderColor: isDarkMode ? '#ffffff' : '#2563eb',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, isDarkMode ? 'rgba(255, 255, 255, 0)' : 'rgba(37, 99, 235, 0)');
          gradient.addColorStop(1, isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(37, 99, 235, 0.2)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: isDarkMode ? '#1e3a8a' : '#1e3a8a', titleColor: '#ffffff', bodyColor: '#e0f2fe' } },
    scales: {
      x: { grid: { display: false }, ticks: { color: isDarkMode ? '#d1d5db' : '#6b7280' } },
      y: { grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }, ticks: { color: isDarkMode ? '#d1d5db' : '#6b7280', beginAtZero: true } },
    },
  };

  // Pie chart data
  const pieData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [riskDistribution.Low, riskDistribution.Medium, riskDistribution.High],
        backgroundColor: ['#34d399', '#fbbf24', '#f87171'],
        borderWidth: 1,
        borderColor: isDarkMode ? '#1f2937' : '#ffffff',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: isDarkMode ? '#d1d5db' : '#1e40af', font: { size: 12 } } },
      tooltip: { backgroundColor: isDarkMode ? '#1e3a8a' : '#1e3a8a', titleColor: '#ffffff', bodyColor: '#e0f2fe' },
    },
  };

  // Slider images
  const sliderImages = [
    'src/assets/Upload.jpg',
    'src/assets/Analyze.jpg',
    'src/assets/display.jpg',
    'src/assets/report.jpg'
  ];

  if (loading) {
    return (
      <div className={`dashboard-home-container ${isDarkMode ? 'dark' : ''}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="loading-container"
        >
          <p>Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // Let AuthContext handle redirect
  }

  return (
    <div className={`dashboard-home-container ${isDarkMode ? 'dark' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-home-header"
      >
        <div className="flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          <h1 className="dashboard-home-title">Welcome, Dr. {user.fullName}</h1>
        </div>
        <p className="dashboard-home-subtitle">Real-time kidney stone detection insights at your fingertips.</p>
      </motion.div>

      {/* Overview Section */}
      <div className="overview-section">
        <h2 className="section-title">Overview</h2>
        <div className="stats-grid">
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="stats-card">
            <div className="card-content">
              <p className="card-label">Total Patients</p>
              <p className="card-value">{stats.totalPatients}</p>
              <Users className="card-icon text-blue-600" />
            </div>
          </motion.div>
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="stats-card">
            <div className="card-content">
              <p className="card-label">Scans Today</p>
              <p className="card-value">{stats.scansToday}</p>
              <FileText className="card-icon text-blue-500" />
            </div>
          </motion.div>
          <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="stats-card">
            <div className="card-content">
              <p className="card-label">High Risk Patients</p>
              <p className="card-value">{stats.highRiskPatients}</p>
              <Activity className="card-icon text-blue-500" />
            </div>
          </motion.div>
          <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="stats-card">
            <div className="card-content">
              <p className="card-label">Detection Accuracy</p>
              <p className="card-value">{stats.detectionAccuracy}%</p>
              <HeartPulse className="card-icon text-blue-600" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* How Our App Works Slider */}
      <div className="slider-section">
        <h2 className="section-title">How Our App Works</h2>
        <Slider images={sliderImages} />
      </div>

      {/* Recent Patients Section */}
      <div className="recent-patients-section">
        <h2 className="section-title">Recent Patients</h2>
        <div className="recent-patients-card">
          {recentActivity.map((patient, index) => (
            <div key={patient.id} className="patient-item">
              <p className="patient-name">Patient {index + 1}:</p>
              <p><span className="label">Name:</span> {patient.patientName}</p>
              <p><span className="label">Status:</span> {patient.hasStone ? 'Stone Detected' : 'No Stone'}</p>
              <p><span className="label">Time:</span> {patient.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <motion.div className="risk-distribution-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="section-title">Patient Risk Distribution</h2>
          <div className="chart-container">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </motion.div>
        <motion.div className="graph-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="section-title">Kidney Stone Scans (Last 7 Days)</h2>
          <div className="chart-container">
            <Line data={graphData} options={graphOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}