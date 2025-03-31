import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isResending, setIsResending] = useState(false); // State to track OTP resending
  const navigate = useNavigate();

  // Set axios default headers for authenticated requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { accessToken, doctor } = response.data;
      setToken(accessToken);
      setUser({ ...doctor, isVerified: true });
      localStorage.setItem('token', accessToken);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async ({ email, password, name }) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/signup', {
        email,
        password,
        name,
        confirmPassword: password
      });

      localStorage.setItem('userEmail', email); // Store email for OTP verification
      setUser({ email, name, doctorId: response.data.doctorId, isVerified: false });

      return response.data; // Useful for handling success
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const email = localStorage.getItem('userEmail'); // Retrieve stored email
      if (!email) throw new Error('Email not found, please sign up again.');

      await axios.post('http://localhost:5000/auth/verify-otp', { email, otp });
      setUser((prev) => ({ ...prev, isVerified: true }));
      localStorage.removeItem('userEmail'); // Cleanup after successful verification
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const resendOTP = async () => {
    try {
      setIsResending(true); // Set loading state
      const email = localStorage.getItem('userEmail'); // Retrieve stored email
      if (!email) throw new Error('Email not found, please sign up again.');

      await axios.post('http://localhost:5000/auth/resend-otp', { email });

      setIsResending(false); // Reset loading state
    } catch (error) {
      setIsResending(false);
      throw new Error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const setProfile1 = async({fullname,dob,gender}) => {
    try{
      const response = await axios.post('http://localhost:5000/auth/setup1', {
        fullname,
        dob,
        gender
    });
      setUser((prev) => ({ ...prev, ...response.data.doctor }));
    }
    catch (error) {
      throw new Error(error.response?.data?.message || 'Profile setup failed');
    }
  }

  const updateProfile = async ({ name, hospital, profileImage }) => {
    try {
      const formData = new FormData();
      if (name) formData.append('name', name);
      if (hospital) formData.append('hospital', hospital);
      if (profileImage) formData.append('profileImage', profileImage);

      const response = await axios.put('http://localhost:5000/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser((prev) => ({ ...prev, ...response.data.doctor }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail'); // Ensure complete logout
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
        updateProfile,
        logout,
        isDarkMode,
        toggleDarkMode,
        isResending
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
