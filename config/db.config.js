// Importa la configuración del entorno desde el archivo env.js
const env = require('./env.js');

// Importa el módulo Sequelize
const Sequelize = require('sequelize');

// Intenta conectar a la base de datos y configurar Sequelize
let sequelize;
try {
  sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: env.pool.max,
      min: env.pool.min,
      acquire: env.pool.acquire,
      idle: env.pool.idle
    }
  });
  console.log("Conexión a la base de datos establecida correctamente.");
} catch (error) {
  console.error("Error al conectar con la base de datos:", error);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Intenta cargar el modelo Proyecto y maneja posibles errores de ruta
try {
  db.Proyecto = require('../models/proyecto.js')(sequelize, Sequelize);
  console.log("Modelo Proyecto cargado correctamente.");
} catch (error) {
  console.error("Error al cargar el modelo Proyecto:", error);
}

module.exports = db;
