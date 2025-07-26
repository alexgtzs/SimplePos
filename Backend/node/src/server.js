const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Servidor Node funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor Node escuchando en puerto ${PORT}`);
});