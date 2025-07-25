import React from 'react';
import Header from '../../components/layout/Header';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showLoginButton={false} />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Sección de imagen (opcional) */}
          <div className="hidden md:block md:w-1/2 bg-blue-600">
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Sistema Punto de Venta</h2>
                <p className="text-blue-100">Gestión completa de ventas e inventario</p>
              </div>
            </div>
          </div>
          
          {/* Sección del formulario */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <LoginForm />
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© {new Date().getFullYear()} Sistema Punto de Venta</p>
      </footer>
    </div>
  );
};

export default LoginPage;