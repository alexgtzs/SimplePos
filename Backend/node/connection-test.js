const { Client } = require('pg');

const client = new Client({
  user: 'postgres',       // Usuario explícito
  host: 'localhost',
  database: 'Productos',
  password: '1234',       // Contraseña explícita
  port: 5432,
});

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ Conexión exitosa. Hora actual:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  } finally {
    await client.end();
  }
}

test();