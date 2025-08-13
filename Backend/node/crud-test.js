const Product = require('./src/models/product.model');
const pool = require('./src/db'); // Importamos pool directamente

async function cleanTestProducts() {
  try {
    await pool.query("DELETE FROM productos WHERE sku LIKE 'TEST-CRUD-%'");
    console.log('✅ Productos de prueba anteriores eliminados');
  } catch (error) {
    console.error('Error limpiando productos de prueba:', error.message);
  }
}

async function testCRUD() {
  try {
    // Limpiar datos de pruebas anteriores
    await cleanTestProducts();
    
    console.log('=== INICIO DE PRUEBAS CRUD ===');
    
    // Datos de prueba con SKU único
    const testProduct = {
      nombre: 'Producto Prueba CRUD',
      descripcion: 'Este es un producto de prueba',
      modelo: 'CRUD-001',
      precio_compra: 100.50,
      precio_venta: 150.99,
      sku: `TEST-CRUD-${Date.now()}`, // SKU único
      codigo_barras: `TEST-${Date.now()}`,
      id_marca: 1,
      id_iva: 1
    };
    
    // --------------------------------------
    // 1. TEST CREATE (Creación)
    // --------------------------------------
    console.log('\n1. Probando CREATE...');
    const createdProduct = await Product.create(testProduct);
    console.log('✅ Producto creado:', {
      id: createdProduct.id_producto,
      nombre: createdProduct.nombre,
      precio: createdProduct.precio_venta
    });
    
    // --------------------------------------
    // 2. TEST READ (Lectura)
    // --------------------------------------
    console.log('\n2. Probando READ...');
    const readProduct = await Product.getById(createdProduct.id_producto);
    
    if (!readProduct) throw new Error('El producto no se encontró');
    if (readProduct.nombre !== testProduct.nombre) throw new Error('Los datos no coinciden');
    
    console.log('✅ Producto leído correctamente:', {
      id: readProduct.id_producto,
      nombre: readProduct.nombre
    });
    
    // --------------------------------------
    // 3. TEST UPDATE (Actualización)
    // --------------------------------------
    console.log('\n3. Probando UPDATE...');
    const updateData = {
      nombre: 'Producto Actualizado',
      precio_venta: 199.99,
      descripcion: 'Descripción actualizada',
      // Mantenemos los campos obligatorios
      modelo: testProduct.modelo,
      precio_compra: testProduct.precio_compra,
      sku: testProduct.sku,
      codigo_barras: testProduct.codigo_barras,
      id_marca: testProduct.id_marca,
      id_iva: testProduct.id_iva
    };
    
    const updatedProduct = await Product.update(createdProduct.id_producto, updateData);
    
    if (updatedProduct.nombre !== updateData.nombre) throw new Error('La actualización falló');
    console.log('✅ Producto actualizado correctamente:', {
      nombre: updatedProduct.nombre,
      nuevo_precio: updatedProduct.precio_venta
    });
    
    // --------------------------------------
    // 4. TEST GET ALL (Obtener todos)
    // --------------------------------------
    console.log('\n4. Probando GET ALL...');
    const allProducts = await Product.getAll();
    
    if (!Array.isArray(allProducts)) throw new Error('No se recibió un array de productos');
    if (!allProducts.some(p => p.id_producto === createdProduct.id_producto)) {
      throw new Error('El producto creado no aparece en el listado');
    }
    
    console.log('✅ Listado de productos obtenido correctamente');
    console.log(`Total de productos: ${allProducts.length}`);
    console.log('Últimos 3 productos:');
    console.table(allProducts.slice(-3));
    
    // --------------------------------------
    // 5. TEST DELETE (Eliminación)
    // --------------------------------------
    console.log('\n5. Probando DELETE...');
    const deletedProduct = await Product.delete(createdProduct.id_producto);
    
    if (!deletedProduct) throw new Error('No se recibió confirmación de eliminación');
    console.log('✅ Producto marcado como inactivo:', {
      id: deletedProduct.id_producto,
      activo: deletedProduct.activo
    });
    
    console.log('\n=== TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO ===');
  } catch (error) {
    console.error('\n❌ ERROR EN LAS PRUEBAS:', error.message);
    console.error('Detalle del error:', error);
  } finally {
    pool.end(); // Cerrar la conexión al finalizar
  }
}

// Ejecutar pruebas
testCRUD();