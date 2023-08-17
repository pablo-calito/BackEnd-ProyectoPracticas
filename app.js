const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/universidad', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión a MongoDB establecida');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

const routes = require('./routes');

app.use(express.json());
app.use('/', routes);

