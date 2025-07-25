import React from 'react';

const SystemInfo = () => {
  const features = [
    {
      title: "Ventas Rápidas",
      description: "Procesa transacciones en segundos con nuestra interfaz optimizada.",
      icon: "💰"
    },
    {
      title: "Inventario",
      description: "Controla tu stock en tiempo real y recibe alertas automáticas.",
      icon: "📦"
    },
    {
      title: "Reportes",
      description: "Genera reportes detallados de ventas, ganancias y más.",
      icon: "📊"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Características del Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemInfo;