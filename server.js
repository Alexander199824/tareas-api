// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db.config'); // Asegúrate de que apunte a la carpeta correcta
const proyectoRoutes = require('./routes/proyectorouter');

dotenv.config();

const app = express();
app.use(cors());

// Configura el tamaño límite para JSON y datos de formulario codificados en URL
app.use(express.json({ limit: '100mb' })); // Ajusta el límite según tus necesidades
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Agrega una ruta para la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Proyectos');
});

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("La base de datos ha sido sincronizada correctamente.");
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });

// Configura las rutas de la API
app.use('/api/proyectos', proyectoRoutes);

const PORT = process.env.PORT || 5000;

// Sincroniza la base de datos con `force: false`
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
    console.error("Error al sincronizar la base de datos:", error);
});
