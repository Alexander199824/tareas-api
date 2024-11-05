const env = require('../config/env');
const Stripe = require('stripe');
const stripe = Stripe(env.stripeSecretKey);
const db = require('../config/db.config');
const Proyecto = db.Proyecto;

exports.createProyecto = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto, metodo_pago, paymentMethodId } = req.body;

    const proyecto = await Proyecto.create({
      titulo,
      descripcion,
      completada: false,
      fecha_vencimiento,
      prioridad: prioridad || 'media',
      asignado_a,
      categoria,
      costo_proyecto,
      pagado: metodo_pago === 'stripe',
      metodo_pago,
      fecha_pago: metodo_pago === 'stripe' ? new Date() : null
    });

    if (metodo_pago === 'stripe' && paymentMethodId) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(costo_proyecto * 100),
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true
      });

      if (paymentIntent.status === 'succeeded') {
        proyecto.pagado = true;
        await proyecto.save();
        res.status(201).json({ message: 'Proyecto y pago completados con éxito', proyecto });
      } else {
        res.status(400).json({ message: 'Error en la confirmación del pago' });
      }
    } else {
      res.status(201).json({ message: 'Proyecto creado con éxito', proyecto });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el proyecto o procesar el pago', error: error.message });
  }
};

exports.getAllProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.findAll();
    res.status(200).json(proyectos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los proyectos', error: error.message });
  }
};

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

exports.updateProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, completada, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto, pagado, metodo_pago } = req.body;

    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const vencido = fecha_vencimiento && new Date(fecha_vencimiento) < new Date();

    await proyecto.update({
      titulo,
      descripcion,
      completada: vencido ? confirm("¿Está completado?") : completada,
      fecha_vencimiento,
      prioridad,
      asignado_a,
      categoria,
      costo_proyecto,
      pagado: metodo_pago === 'stripe' ? true : pagado,
      metodo_pago,
      fecha_pago: metodo_pago === 'stripe' ? new Date() : proyecto.fecha_pago
    });

    res.status(200).json({ message: 'Proyecto actualizado con éxito', proyecto });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el proyecto', error: error.message });
  }
};

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

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ message: 'El monto es requerido' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear PaymentIntent', error: error.message });
  }
};
