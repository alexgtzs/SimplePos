// node/test-db.js
const pool = require('./src/db');  // Cambiado para apuntar correctamente

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    console.log('Conexión exitosa. Hora actual:', res.rows[0].current_time);
    
    // Probar consulta de productos
    const products = await pool.query('SELECT * FROM productos LIMIT 1');
    console.log('Primer producto:', products.rows[0]);
  } catch (err) {
    console.error('Error de conexión:', err);
  } finally {
    pool.end();
  }
}

testConnection();