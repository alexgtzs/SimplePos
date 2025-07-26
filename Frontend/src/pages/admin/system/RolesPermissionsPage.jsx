import React, { useState } from 'react';

const RolesPermissionsPage = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Administrador',
      permissions: ['users:manage', 'products:manage', 'system:configure', 'reports:view']
    },
    {
      id: 2,
      name: 'Supervisor',
      permissions: ['products:manage', 'reports:view']
    },
    {
      id: 3,
      name: 'Cajero',
      permissions: ['sales:process']
    }
  ]);

  const allPermissions = [
    { code: 'users:manage', description: 'Gestionar usuarios' },
    { code: 'products:manage', description: 'Gestionar productos' },
    { code: 'system:configure', description: 'Configurar sistema' },
    { code: 'reports:view', description: 'Ver reportes' },
    { code: 'sales:process', description: 'Procesar ventas' }
  ];

  const [newRoleName, setNewRoleName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const togglePermission = (roleId, permission) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === roleId
          ? {
              ...role,
              permissions: role.permissions.includes(permission)
                ? role.permissions.filter(p => p !== permission)
                : [...role.permissions, permission]
            }
          : role
      )
    );
  };

  const addRole = () => {
    if (newRoleName.trim()) {
      setRoles(prev => [
        ...prev,
        { id: Date.now(), name: newRoleName.trim(), permissions: [] }
      ]);
      setNewRoleName('');
    }
  };

  const startEditing = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = (id) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === id ? { ...role, name: editName } : role
      )
    );
    setEditingId(null);
  };

  const deleteRole = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      setRoles(prev => prev.filter(role => role.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Roles y Permisos</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Rol</h2>
        <div className="flex">
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Nombre del rol"
            className="flex-1 px-4 py-2 border rounded-l-lg"
          />
          <button
            onClick={addRole}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Lista de Roles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permisos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === role.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      role.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {allPermissions.map((perm) => (
                        <label key={perm.code} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={role.permissions.includes(perm.code)}
                            onChange={() => togglePermission(role.id, perm.code)}
                            className="rounded text-blue-600"
                          />
                          <span>{perm.description}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === role.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(role.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(role.id, role.name)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissionsPage;