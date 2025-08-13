const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Servidor Node funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor Node escuchando en puerto ${PORT}`);
});

// Agrega esto después de las otras rutas
const productRoutes = require('./src/routes/product.routes');
app.use('/api/products', productRoutes);