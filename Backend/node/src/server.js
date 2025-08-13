const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configuración de CORS (debe ir al inicio)
app.use(cors({
  origin: 'http://localhost:3000', // Asegúrate que este sea el puerto correcto de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Node funcionando');
});

// Rutas de productos
const productRoutes = require('./routes/product.routes'); // Asegúrate que la ruta sea correcta
app.use('/api/products', productRoutes);

// Iniciar servidor (solo una vez)
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});