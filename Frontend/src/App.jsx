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

function App() {
  return (
    <Routes>
    {/* Rutas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

  
      {/* Rutas de administración */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="products" element={<ProductListPage />} />
      </Route>
      
      {/* Ruta de error 404 */}
      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  );
}

export default App;