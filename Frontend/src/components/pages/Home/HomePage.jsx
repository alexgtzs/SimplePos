import React from 'react';
import Header from '../../../components/layout/Header';
import ImageCarousel from '../../sections/ImageCarousel';
import SystemInfo from '../../sections/SystemInfo';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ImageCarousel />
        <SystemInfo />
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© {new Date().getFullYear()} Sistema Punto de Venta. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;