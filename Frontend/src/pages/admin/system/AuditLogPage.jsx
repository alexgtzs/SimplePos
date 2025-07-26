import React, { useState } from 'react';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([
    { id: 1, user: 'Admin', action: 'Creó nuevo usuario: María García', timestamp: '2023-05-15 09:30:22', ip: '192.168.1.1' },
    { id: 2, user: 'María García', action: 'Actualizó producto: iPhone 13', timestamp: '2023-05-15 10:15:45', ip: '192.168.1.3' },
    { id: 3, user: 'Admin', action: 'Eliminó categoría: Accesorios', timestamp: '2023-05-14 16:20:33', ip: '192.168.1.1' },
    { id: 4, user: 'Carlos López', action: 'Realizó venta #12345', timestamp: '2023-05-14 14:05:12', ip: '192.168.1.5' },
    { id: 5, user: 'Admin', action: 'Actualizó permisos de rol: Supervisor', timestamp: '2023-05-13 11:40:18', ip: '192.168.1.1' }
  ]);

  const [filters, setFilters] = useState({
    user: '',
    action: '',
    dateFrom: '',
    dateTo: ''
  });

  const filteredLogs = logs.filter(log => {
    return (
      (filters.user === '' || log.user.toLowerCase().includes(filters.user.toLowerCase())) &&
      (filters.action === '' || log.action.toLowerCase().includes(filters.action.toLowerCase())) &&
      (filters.dateFrom === '' || new Date(log.timestamp) >= new Date(filters.dateFrom)) &&
      (filters.dateTo === '' || new Date(log.timestamp) <= new Date(filters.dateTo + ' 23:59:59'))
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Registro de Actividades</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              name="user"
              value={filters.user}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Acción</label>
            <input
              type="text"
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Desde</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Hasta</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{log.user}</td>
                  <td className="px-6 py-4">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;