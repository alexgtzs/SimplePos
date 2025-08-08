import React from 'react';
import StatsCard from '../../components/admin/StatsCard';

const VendedorDashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Vendedor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Ventas Hoy" 
          value="$1,240" 
          icon="💰" 
          color="green" 
        />
        <StatsCard 
          title="Clientes Nuevos" 
          value="3" 
          icon="👥" 
          color="blue" 
        />
        <StatsCard 
          title="Productos Vendidos" 
          value="24" 
          icon="📦" 
          color="purple" 
        />
      </div>
    </div>
  );
};

export default VendedorDashboardPage;