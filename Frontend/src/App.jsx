import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
// Importa otras páginas cuando las crees
// import LoginPage from './pages/Login/LoginPage';
// import DashboardPage from './pages/Dashboard/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;