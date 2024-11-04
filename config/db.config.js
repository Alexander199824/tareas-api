// Importa la configuración del entorno desde el archivo env.js
const env = require('./env.js');

// Importa el módulo Sequelize
const Sequelize = require('sequelize');

// Crea una nueva instancia de Sequelize para conectarse a la base de datos
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host, // Dirección del host de la base de datos
  dialect: env.dialect, // Dialecto de la base de datos (e.g., 'mysql', 'postgres')
  dialectOptions: {
    ssl: { // Configuración de SSL
      require: true, // Requiere conexión SSL
      rejectUnauthorized: false // No rechazar conexiones no autorizadas (útil para ciertos entornos)
    }
  },
  pool: {
    max: env.pool.max, // Número máximo de conexiones en el pool
    min: env.pool.min, // Número mínimo de conexiones en el pool
    acquire: env.pool.acquire, // Tiempo máximo de espera para adquirir una conexión
    idle: env.pool.idle, // Tiempo máximo que una conexión puede estar inactiva
  }
});


const db = {};


db.Sequelize = Sequelize;

db.sequelize = sequelize;

db.Proyecto = require('../models/proyecto.js')(sequelize, Sequelize);



module.exports = db;
