import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        try {
          console.log('Fetching user data with token:', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('http://localhost:5000/auth/profile');
          setUser({ ...response.data.doctor, isVerified: true });
          console.log('User data fetched:', response.data.doctor);
        } catch (error) {
          console.error('Failed to fetch user data:', error.response?.data || error.message);
        }
      } else if (!token) {
        console.log('No token found, removing Authorization header');
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    };

    fetchUserData();
  }, [token, navigate]);

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { accessToken, doctor } = response.data;
      console.log('Login successful, setting token:', accessToken);
      setToken(accessToken);
      setUser({ ...doctor, isVerified: true });
      localStorage.setItem('token', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      navigate('/dashboard');
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
        confirmPassword: password,
      });

      localStorage.setItem('userEmail', email);
      setUser({ email, name, doctorId: response.data.doctorId, isVerified: false });
      navigate('/otp');
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
      console.log('OTP verified, setting token:', accessToken);
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      setUser((prev) => ({ ...prev, doctorId, isVerified: true }));
      localStorage.removeItem('userEmail');
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
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
      toast.success('OTP resent successfully');
      setIsResending(false);
    } catch (error) {
      setIsResending(false);
      throw new Error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      console.log('Sending forgot password request for:', email);
      const response = await axios.post('http://localhost:5000/auth/forgot-password', { email });
      localStorage.setItem('resetEmail', email);
      navigate('/verify-code');
      toast.success('Reset OTP sent to your email');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyResetCode = async (otp) => {
    try {
      setLoading(true);
      const email = localStorage.getItem('resetEmail');
      if (!email) throw new Error('Email not found, please start the reset process again.');

      const response = await axios.post('http://localhost:5000/auth/verify-reset-code', { email, otp });
      const { resetToken } = response.data;
      console.log('Reset OTP verified, setting reset token:', resetToken);
      localStorage.setItem('resetToken', resetToken);
      localStorage.removeItem('resetEmail');
      navigate('/reset-password');
      toast.success('OTP verified successfully');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ newPassword, confirmPassword }) => {
    try {
      setLoading(true);
      const resetToken = localStorage.getItem('resetToken');
      if (!resetToken) throw new Error('Reset token not found, please start the reset process again.');

      console.log('Sending reset password request:', { newPassword });
      const response = await axios.post(
        'http://localhost:5000/auth/reset-password',
        { newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${resetToken}` } }
      );
      localStorage.removeItem('resetToken');
      navigate('/login');
      toast.success('Password reset successfully. Please log in.');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const setupProfile = async (step, data) => {
    try {
      setLoading(true);
      console.log('Preparing setup-profile request:', { step, token });

      const formData = data instanceof FormData ? data : new FormData();
      if (!(data instanceof FormData)) {
        formData.append('step', step);
        for (const key in data) {
          if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        }
      }

      console.log('FormData contents before sending:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.size} bytes, ${value.type})` : value);
      }

      const response = await axios.post('http://localhost:5000/auth/setup-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Setup profile response:', response.data);
      setUser((prev) => ({ ...prev, ...response.data.doctor }));

      if (step === '1') {
        navigate('/setup-profile/step2');
      } else if (step === '2') {
        navigate('/setup-profile/step3');
      } else if (step === '3') {
        navigate('/dashboard');
      } else if (step === 'update') {
        navigate('/dashboard/profile');
      }

      return response.data;
    } catch (error) {
      console.error('Setup profile failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Profile setup failed');
    } finally {
      setLoading(false);
    }
  };

  const upload = async ({ patientName, patientId, age, gender, date, ctScan }) => {
    const formData = new FormData();
    formData.append('patientName', patientName);
    formData.append('patientId', patientId);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('date', date);
    formData.append('ctScan', ctScan);

    try {
      console.log('Sending upload request with token:', token);
      const response = await axios.post('http://localhost:5000/patient/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Upload response:', response.data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Upload failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('welcomeShown');
    localStorage.removeItem('isDarkMode');
    setIsDarkMode(false);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const fetchStats = debounce(async () => {
    try {
      const response = await axios.get('http://localhost:5000/patient/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch stats error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to fetch stats');
      return null;
    }
  }, 2000);

  const updatePassword = async ({ currentPassword, newPassword }) => {
    try {
      setLoading(true);
      console.log('Sending password update request:', { currentPassword, newPassword });
      const response = await axios.post(
        'http://localhost:5000/auth/update-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Password update response:', response.data);
      toast.success('Password updated successfully');
      return response.data;
    } catch (error) {
      console.error('Password update error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.isVerified && !!token,
        login,
        signup,
        verifyOTP,
        resendOTP,
        forgotPassword,
        verifyResetCode,
        resetPassword,
        setupProfile,
        upload,
        logout,
        isDarkMode,
        toggleDarkMode,
        isResending,
        loading,
        fetchStats,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}