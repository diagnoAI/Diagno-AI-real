import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, HeartPulse, Activity, Calendar, Stethoscope } from 'lucide-react';
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
} from 'chart.js';
import './DashboardHome.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Detection Progress Circle
const DetectionProgress = ({ percentage }) => (
  <div className="relative w-12 h-12">
    <svg className="w-full h-full" viewBox="0 0 36 36">
      <path
        className="text-blue-100"
        fill="none"
        strokeWidth="3"
        stroke="currentColor"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        className="text-blue-600"
        fill="none"
        strokeWidth="3"
        strokeDasharray={`${percentage}, 100`}
        stroke="currentColor"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-xs font-medium text-blue-900">{percentage}%</span>
    </div>
  </div>
);

// Initial stats data (removed images)
const initialStats = [
  { label: 'Patients Today', value: 32, icon: Users, color: 'blue-600' },
  { label: 'Kidney Stone Scans', value: 15, icon: FileText, color: 'blue-500' },
  { label: 'Detection Accuracy', value: 92, icon: HeartPulse, color: 'blue-600', isProgress: true },
  { label: 'High Risk Patients', value: 8, icon: Activity, color: 'blue-500' },
  { label: 'Appointments', value: 10, icon: Calendar, color: 'blue-400' },
];

// Quick stats data
const quickStats = [
  { label: 'Total Scans (Month)', value: 245 },
  { label: 'Avg. Risk Score', value: '7.8' },
];

// Recent activity data
const recentActivity = [
  { id: 1, action: 'Scan Completed', patient: 'John Doe', time: '10:30 AM' },
  { id: 2, action: 'High Risk Detected', patient: 'Jane Smith', time: '9:15 AM' },
  { id: 3, action: 'Appointment Scheduled', patient: 'Mike Johnson', time: '8:45 AM' },
];

// Simulated trend data for the graph (past 7 days)
const initialTrendData = [12, 15, 10, 18, 14, 20, 15];

// Risk distribution data for the pie chart
const riskDistributionData = {
  labels: ['Low Risk', 'Medium Risk', 'High Risk'],
  datasets: [
    {
      data: [60, 30, 10], // Example distribution: 60% low, 30% medium, 10% high
      backgroundColor: ['#34d399', '#fbbf24', '#f87171'],
      borderWidth: 1,
      borderColor: '#ffffff',
    },
  ],
};

export function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [trendData, setTrendData] = useState(initialTrendData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => {
          if (stat.label === 'Patients Today') {
            return { ...stat, value: stat.value + Math.floor(Math.random() * 2) };
          }
          if (stat.label === 'Kidney Stone Scans') {
            return { ...stat, value: stat.value + Math.floor(Math.random() * 1) };
          }
          if (stat.label === 'High Risk Patients') {
            return { ...stat, value: stat.value + Math.floor(Math.random() * 1) };
          }
          if (stat.label === 'Appointments') {
            return { ...stat, value: stat.value + Math.floor(Math.random() * 1) };
          }
          if (stat.label === 'Detection Accuracy') {
            const accuracy = Math.min(100, stat.value + Math.floor(Math.random() * 2));
            return { ...stat, value: accuracy };
          }
          return stat;
        })
      );

      // Update trend data
      setTrendData((prevData) => {
        const newData = [...prevData];
        newData.shift(); // Remove the oldest data point
        newData.push(Math.floor(Math.random() * 10 + 10)); // Add a new random data point (10-20)
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
    hover: {
      y: -5,
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  // Graph data (Line chart)
  const graphData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Kidney Stone Scans',
        data: trendData,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e3a8a',
        titleColor: '#ffffff',
        bodyColor: '#e0f2fe',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          color: '#6b7280',
          beginAtZero: true,
        },
      },
    },
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1e40af',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1e3a8a',
        titleColor: '#ffffff',
        bodyColor: '#e0f2fe',
      },
    },
  };

  return (
    <div className="dashboard-home-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-home-header"
      >
        <div className="flex items-center gap-3">
          <Stethoscope className="h-7 w-7 text-blue-600" />
          <h2 className="dashboard-home-title">
            Welcome, Dr. {user?.name || 'Doctor'}
          </h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="dashboard-home-text"
        >
          Real-time kidney stone detection insights at your fingertips.
        </motion.p>
      </motion.div>

      {/* Main Stats Section */}
      <div className="stats-section">
        <h3 className="section-title">Today’s Overview</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="stats-card neumorphic relative overflow-hidden"
            >
              <div className="relative z-10 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                  {stat.isProgress ? (
                    <DetectionProgress percentage={stat.value} />
                  ) : (
                    <p className="mt-1 text-xl font-semibold text-gray-900">{stat.value}</p>
                  )}
                </div>
                <div className="p-1 rounded-full bg-blue-50">
                  <stat.icon className={`h-4 w-4 text-${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="quick-stats-section">
        <h3 className="section-title">Monthly Summary</h3>
        <div className="quick-stats-grid">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="quick-stats-card neumorphic"
            >
              <p className="text-xs font-medium text-gray-600">{stat.label}</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity-section">
        <h3 className="section-title">Recent Activity</h3>
        <div className="recent-activity-card neumorphic">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-3 px-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.patient}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risk Distribution Section */}
      <div className="risk-distribution-section">
        <h3 className="section-title">Patient Risk Distribution</h3>
        <div className="risk-distribution-card neumorphic">
          <div className="relative h-64">
            <Pie data={riskDistributionData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="graph-section">
        <h3 className="section-title">Kidney Stone Scans (Last 7 Days)</h3>
        <div className="graph-card neumorphic">
          <div className="relative h-64">
            <Line data={graphData} options={graphOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}