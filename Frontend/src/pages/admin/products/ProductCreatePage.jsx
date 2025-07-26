import React, { useState } from 'react';

const ProductCreatePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electrónicos',
    price: '',
    cost: '',
    stock: '',
    barcode: '',
    image: null
  });

  const categories = ['Electrónicos', 'Computadoras', 'Ropa', 'Hogar', 'Alimentos'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para crear producto
    console.log('Producto creado:', formData);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Nombre del Producto</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Precio de Venta ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Costo ($)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                step="0.01"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Stock Inicial</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Código de Barras</label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Imagen del Producto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
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
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreatePage;