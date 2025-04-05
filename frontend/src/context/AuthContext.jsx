import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Set axios default headers for authenticated requests
  useEffect(() => {
    if (token && !user) {
      console.log("Setting Authorization header with token:", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else if (!token) {
      console.log("No token found, removing Authorization header");
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, navigate]);

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { accessToken, doctor } = response.data;
      console.log("Login successful, setting token:", accessToken);
      setToken(accessToken);
      setUser({ ...doctor, isVerified: true });
      localStorage.setItem('token', accessToken);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ email, password, name }) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/auth/signup', {
        email,
        password,
        name,
        confirmPassword: password
      });

      localStorage.setItem('userEmail', email);
      setUser({ email, name, doctorId: response.data.doctorId, isVerified: false });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      setLoading(true);
      const email = localStorage.getItem('userEmail');
      if (!email) throw new Error('Email not found, please sign up again.');

      const response = await axios.post('http://localhost:5000/auth/verify-otp', { email, otp });
      const { accessToken, doctorId } = response.data;
      console.log("OTP verified, setting token:", accessToken);
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      setUser((prev) => ({ ...prev, doctorId, isVerified: true }));
      localStorage.removeItem('userEmail');
      navigate('/setup-profile/step1');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setIsResending(true);
      const email = localStorage.getItem('userEmail');
      if (!email) throw new Error('Email not found, please sign up again.');

      await axios.post('http://localhost:5000/auth/resend-otp', { email });

      setIsResending(false);
    } catch (error) {
      setIsResending(false);
      throw new Error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const setupProfile = async (step, data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("step", step);
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }

      console.log("Sending setup-profile request with token:", token);
      const response = await axios.post('http://localhost:5000/auth/setup-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Setup profile response:", response.data);
      setUser((prev) => ({ ...prev, ...response.data.doctor }));

      if (step === "1") {
        navigate('/setup-profile/step2');
      } else if (step === "2") {
        navigate('/setup-profile/step3');
      } else if (step === "3" && response.data.profileSetupCompleted) {
        navigate('/dashboard');
      }

      return response.data;
    } catch (error) {
      console.error("Setup profile failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Profile setup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.isVerified && !!token,
        login,
        signup,
        verifyOTP,
        resendOTP,
        setupProfile,
        logout,
        isDarkMode,
        toggleDarkMode,
        isResending,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}