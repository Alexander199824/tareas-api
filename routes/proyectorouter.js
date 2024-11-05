const express = require('express');
const router = express.Router();
const {
  createProyecto,
  getAllProyectos,
  getProyectoById,
  updateProyecto,
  deleteProyecto,
  createPaymentIntent, // Agregar el controlador de PaymentIntent
} = require('../controllers/proyecto.controller');

// Rutas para proyectos
router.post('/', createProyecto);
router.get('/', getAllProyectos);
router.get('/:id', getProyectoById);
router.put('/:id', updateProyecto);
router.delete('/:id', deleteProyecto);

// Ruta para crear PaymentIntent
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;

