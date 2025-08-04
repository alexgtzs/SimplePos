import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import AdminLayout from './components/admin/AdminLayout';
// Páginas Públicas

import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
// Páginas de Administrador
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserListPage from './pages/admin/users/UserListPage';
import UserCreatePage from './pages/admin/users/UserCreatePage';
import UserEditPage from './pages/admin/users/UserEditPage';
import ProductListPage from './pages/admin/products/ProductListPage';
import ProductCreatePage from './pages/admin/products/ProductCreatePage';
import ProductEditPage from './pages/admin/products/ProductEditPage';
import ProductCategoriesPage from './pages/admin/products/ProductCategoriesPage';
import RolesPermissionsPage from './pages/admin/system/RolesPermissionsPage';
import AuditLogPage from './pages/admin/system/AuditLogPage';

// Importación de la nueva página de prueba
import TestPage from './pages/admin/TestPage';

// Componente protegido
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserListPage />} />
      </Route>
      
      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;