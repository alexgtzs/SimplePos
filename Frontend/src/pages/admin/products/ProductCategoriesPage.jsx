import React, { useState } from 'react';

const ProductCategoriesPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electrónicos', productCount: 24 },
    { id: 2, name: 'Computadoras', productCount: 18 },
    { id: 3, name: 'Ropa', productCount: 42 },
    { id: 4, name: 'Hogar', productCount: 35 },
    { id: 5, name: 'Alimentos', productCount: 29 }
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories(prev => [
        ...prev,
        { id: Date.now(), name: newCategory.trim(), productCount: 0 }
      ]);
      setNewCategory('');
    }
  };

  const startEditing = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  const saveEdit = (id) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, name: editValue } : cat
      )
    );
    setEditingId(null);
  };

  const deleteCategory = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Categorías</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Nueva Categoría</h2>
        <div className="flex">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nombre de la categoría"
            className="flex-1 px-4 py-2 border rounded-l-lg"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Lista de Categorías</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.productCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(category.id)}
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
                          onClick={() => startEditing(category.id, category.name)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={category.productCount > 0}
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

export default ProductCategoriesPage;