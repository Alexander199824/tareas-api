// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db.config');
const proyectoRoutes = require('./routes/proyectorouter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Lista de URLs permitidas para CORS
const allowedOrigins = [
  'http://localhost:3000', // URL para desarrollo local
  'https://frontend-tareas-app.onrender.com' // URL de producción
];

// Configuración de CORS para aceptar múltiples orígenes
app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitudes sin origen, por ejemplo, desde Postman
    if (!origin) return callback(null, true);

    // Verifica si el origen está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Proyectos');
});

app.use('/api/proyectos', proyectoRoutes);

// Sincroniza la base de datos y luego inicia el servidor
db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
  console.error("Error al sincronizar la base de datos:", error);
});
