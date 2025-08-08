import React from 'react';
import StatsCard from '../../components/admin/StatsCard';

const ConsultorDashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Consultor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Reportes Generados" 
          value="12" 
          icon="📊" 
          color="blue" 
        />
        <StatsCard 
          title="Ventas Totales" 
          value="$24,580" 
          icon="💰" 
          color="green" 
        />
        <StatsCard 
          title="Productos Analizados" 
          value="156" 
          icon="📦" 
          color="purple" 
        />
      </div>
    </div>
  );
};

export default ConsultorDashboardPage;