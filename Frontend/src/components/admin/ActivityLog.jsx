import React from 'react';

const ActivityLog = () => {
  const activities = [
    { id: 1, user: 'Juan Pérez', action: 'editó el producto iPhone 13', time: 'hace 2 horas' },
    { id: 2, user: 'María García', action: 'creó un nuevo usuario', time: 'hace 4 horas' },
    { id: 3, user: 'Carlos López', action: 'actualizó el inventario', time: 'hace 5 horas' },
    { id: 4, user: 'Ana Martínez', action: 'asignó nuevo rol', time: 'hace 1 día' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Últimas Actividades</h3>
      <ul className="space-y-4">
        {activities.map(activity => (
          <li key={activity.id} className="border-b pb-3 last:border-b-0">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="text-gray-600">👤</span>
              </div>
              <div>
                <p className="text-gray-800">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;