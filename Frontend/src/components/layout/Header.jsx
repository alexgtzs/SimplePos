import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ showLoginButton = true }) => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sistema Punto de Venta</h1>
        {showLoginButton && (
          <Link 
            to="/login" 
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;