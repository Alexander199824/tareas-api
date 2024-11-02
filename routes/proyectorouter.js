// routes/proyectorouter.js
const express = require('express');
const router = express.Router();
const {
  createProyecto,
  getAllProyectos,
  getProyectoById,
  updateProyecto,
  deleteProyecto
} = require('../controllers/proyecto.controller');

// Ruta para crear un nuevo proyecto
router.post('/', createProyecto);

// Ruta para obtener todos los proyectos
router.get('/', getAllProyectos);

// Ruta para obtener un proyecto por ID
router.get('/:id', getProyectoById);

// Ruta para actualizar un proyecto
router.put('/:id', updateProyecto);

// Ruta para eliminar un proyecto
router.delete('/:id', deleteProyecto);

module.exports = router;
