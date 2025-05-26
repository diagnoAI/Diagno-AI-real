import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { FeaturesPage } from './pages/FeaturesPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { OTP } from './pages/Auth/OTP';
import { SetupProfileStep1 } from './pages/Auth/SetupProfileStep1';
import { SetupProfileStep2 } from './pages/Auth/SetupProfileStep2';
import { SetupProfileStep3 } from './pages/Auth/SetupProfileStep3';
import { Dashboard } from './pages/Dashboard/Dashboard.jsx';
import './App.css';
import NotFound from './components/NotFound.jsx';
import NotFound2 from './components/NotFound2.jsx';
import { ForgotPassword } from './pages/Auth/ForgotPassword.jsx';
import { VerifyCode } from './pages/Auth/VerifyCode.jsx';
import { ResetPassword } from './pages/Auth/ResetPassword.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { isDarkMode } = useAuth();

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <Landing />
            </>
          }
        />
        <Route
          path="/features"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <FeaturesPage />
            </>
          }
        />
        <Route
          path="/workflow"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <WorkflowPage />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <AboutPage />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <ContactPage />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <Login />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <Signup />
            </>
          }
        />
        <Route
          path="/otp"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <OTP />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <ForgotPassword/>
            </>
          }
          />
          <Route
          path="/verify-code"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <VerifyCode/>
            </>
          }
          />
           <Route
          path="/reset-password"
          element={
            <>
              <Navbar />
              <ScrollToTop />
              <ResetPassword/>
            </>
          }
          />
        <Route path="/setup-profile/step1" element={<SetupProfileStep1 />} />
        <Route path="/setup-profile/step2" element={<SetupProfileStep2 />} />
        <Route path="/setup-profile/step3" element={<SetupProfileStep3 />} />
        <Route path="*" element={<NotFound2 />} />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;