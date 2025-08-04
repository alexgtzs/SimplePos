import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    role: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    if (token && user && role) {
      setAuthState({ token, user: JSON.parse(user), role });
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('role', data.role);
    
    // Obtener información del usuario
    try {
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      });
      
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      setAuthState({
        token: data.access_token,
        user: userResponse.data,
        role: data.role
      });
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setAuthState({ token: null, user: null, role: null });
    navigate('/login');
  };

  const value = {
    ...authState,
    loading,
    login,
    logout,
    isAuthenticated: !!authState.token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};