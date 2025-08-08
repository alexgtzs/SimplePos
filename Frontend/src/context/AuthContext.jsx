import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null, // Asegúrate de que esto está presente
    userData: null,
    loading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');

    if (token && role && email) {
      setAuthState({
        isAuthenticated: true,
        role: role,
        userData: { email },
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
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('email', data.email);

    setAuthState({
      isAuthenticated: true,
      role: data.role,
      userData: {
        email: data.email
      },
      loading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setAuthState({
      isAuthenticated: false,
      role: null,
      userData: null,
      loading: false
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      // Añade estos helpers para mayor claridad
      isAdmin: authState.role === 'admin',
      isVendedor: authState.role === 'vendedor',
      isConsultor: authState.role === 'consultor'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);