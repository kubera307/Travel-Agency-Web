import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('travel_india_token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.success) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Failed to load user session', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();

    // Listen for security session expiration events from API client
    const handleSessionExpired = () => {
      logout();
    };
    window.addEventListener('auth:session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session_expired', handleSessionExpired);
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.token) {
      localStorage.setItem('travel_india_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, phone, password) => {
    const res = await api.post('/auth/register', { name, email, phone, password });
    if (res.success && res.token) {
      localStorage.setItem('travel_india_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('travel_india_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.success) {
      const refreshed = await api.get('/auth/me');
      if (refreshed.success) setUser(refreshed.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isStaff: user?.role === 'STAFF',
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

