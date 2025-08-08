// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    userData: null,
    loading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (token && role) {
      setAuthState({
        isAuthenticated: true,
        role: role,
        userData: userData,
        loading: false
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        role: null,
        userData: null,
        loading: false
      });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userData', JSON.stringify({
      username: data.username,
      email: data.email
    }));
    
    setAuthState({
      isAuthenticated: true,
      role: data.role,
      userData: {
        username: data.username,
        email: data.email
      },
      loading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
    setAuthState({
      isAuthenticated: false,
      role: null,
      userData: null,
      loading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);