import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const login = async ({ email, password }) => {
    setUser({ email, isVerified: true });
  };

  const signup = async ({ email, password, name }) => {
    setUser({ email, name, isVerified: false });
  };

  const verifyOTP = async (otp) => {
    setUser((prev) => ({ ...prev, isVerified: true }));
  };

  const updateProfile = async ({ name, hospital, profileImage }) => {
    setUser((prev) => ({
      ...prev,
      name: name || prev.name,
      hospital: hospital || prev.hospital,
      profileImage: profileImage instanceof File ? URL.createObjectURL(profileImage) : profileImage || prev.profileImage,
    }));
  };
  const logout = () => {
    setUser(null); // Clear user data
    // No need to store email/password here; they're local to Login
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user?.isVerified, login, signup, verifyOTP, updateProfile, logout, isDarkMode, toggleDarkMode }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}