import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserEditPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Activo'
  });

  useEffect(() => {
    // Simulación de carga de datos del usuario
    const fetchUser = async () => {
      // En una aplicación real, harías una llamada a la API aquí
      const mockUser = {
        id: id,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'Administrador',
        status: 'Activo'
      };
      setUser(mockUser);
      setFormData(mockUser);
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para actualizar usuario
    console.log('Usuario actualizado:', formData);
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Usuario: {user.name}</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Administrador">Administrador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Cajero">Cajero</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;