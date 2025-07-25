import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/Home/HomePage';
// Importa otras páginas cuando las crees
// import LoginPage from './pages/Login/LoginPage';
// import DashboardPage from './pages/Dashboard/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      {/* Añade más rutas cuando las necesites */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
    </Routes>
  );
}

export default App;