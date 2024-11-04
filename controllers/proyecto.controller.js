// controllers/proyecto.controller.js
const env = require('../config/env');
const Stripe = require('stripe');
const stripe = Stripe(env.stripeSecretKey);
const db = require('../models/proyecto');
const Proyecto = db.Proyecto;
const Payment = db.Payment;

// Crear un nuevo proyecto con detalles de pago y PaymentIntent
exports.createProyecto = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto, metodo_pago, paymentMethodId } = req.body;

    const proyecto = await Proyecto.create({
      titulo,
      descripcion,
      completada: false, // valor por defecto
      fecha_vencimiento,
      prioridad: prioridad || 'media', // valor por defecto
      asignado_a,
      categoria,
      costo_proyecto,
      pagado: metodo_pago === 'stripe', // Marcar como pagado si se usa Stripe
      metodo_pago,
      fecha_pago: metodo_pago === 'stripe' ? new Date() : null // Fecha de pago si se proporciona método
    });

    if (metodo_pago === 'stripe' && paymentMethodId) {
      // Crear y confirmar PaymentIntent con el ID del método de pago
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(costo_proyecto * 100), // Convertir a centavos
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true
      });

      if (paymentIntent.status === 'succeeded') {
        res.status(201).json({
          message: 'Proyecto y pago completados con éxito',
          proyecto
        });
      } else {
        res.status(400).json({
          message: 'Error en la confirmación del pago'
        });
      }
    } else {
      res.status(201).json({ message: 'Proyecto creado con éxito', proyecto });
    }
  } catch (error) {
    console.error('Error al crear proyecto o procesar el pago:', error);
    res.status(500).json({ message: 'Error al crear el proyecto o procesar el pago', error: error.message });
  }
};

// Obtener todos los proyectos
exports.getAllProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.findAll();
    res.status(200).json(proyectos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los proyectos', error: error.message });
  }
};

// Obtener un proyecto por ID
exports.getProyectoById = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findByPk(id);
    if (proyecto) {
      res.status(200).json(proyecto);
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proyecto', error: error.message });
  }
};

// Actualizar un proyecto
exports.updateProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, completada, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto, pagado, metodo_pago } = req.body;

    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    await proyecto.update({
      titulo,
      descripcion,
      completada,
      fecha_vencimiento,
      prioridad,
      asignado_a,
      categoria,
      costo_proyecto,
      pagado: metodo_pago ? true : pagado, // Actualizar estado de pago
      metodo_pago,
      fecha_pago: metodo_pago ? new Date() : proyecto.fecha_pago // Actualizar fecha de pago si se agrega método
    });

    res.status(200).json({ message: 'Proyecto actualizado con éxito', proyecto });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el proyecto', error: error.message });
  }
};

// Eliminar un proyecto
exports.deleteProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    await proyecto.destroy();
    res.status(200).json({ message: 'Proyecto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
  }
};
