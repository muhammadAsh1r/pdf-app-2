'use client';

import React, { createContext, useState, useEffect } from 'react';
import { API_BASE } from '@/utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await fetch(`${API_BASE}/auth/me/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    const response = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    await checkAuth();
    return data;
  };

  const register = async (username, email, password, password2) => {
    const response = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, password2 }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(Object.values(error).flat().join(', '));
    }
    
    return await response.json();
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        await fetch(`${API_BASE}/auth/logout/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const changePassword = async (oldPassword, newPassword) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE}/auth/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(Object.values(error).flat().join(', '));
    }
    
    return await response.json();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, changePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};