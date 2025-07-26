const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de Control</h1>
      
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium">Usuarios registrados</h3>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium">Productos en stock</h3>
          <p className="text-3xl font-bold mt-2">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium">Ventas hoy</h3>
          <p className="text-3xl font-bold mt-2">$3,240</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;