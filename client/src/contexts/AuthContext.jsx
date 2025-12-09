import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // Verify token is still valid by fetching current user
          const response = await authService.getCurrentUser();
          setUser(response.data);
        }
      } catch (err) {
        // Token is invalid or expired
        console.error('Auth initialization error:', err);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register
  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return { success: true, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Login
  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return { success: true, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setError(null);
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    setError(null);
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.data);
      return { success: true, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (passwordData) => {
    setError(null);
    try {
      const response = await authService.updatePassword(passwordData);
      return { success: true, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Password update failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;