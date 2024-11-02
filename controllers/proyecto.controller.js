// controllers/proyecto.controller.js
const db = require('../models/proyecto');
const Proyecto = db.Proyecto;

// Crear un nuevo proyecto
exports.createProyecto = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto } = req.body;
    const proyecto = await Proyecto.create({
      titulo,
      descripcion,
      completada: false, // valor por defecto
      fecha_vencimiento,
      prioridad: prioridad || 'media', // valor por defecto
      asignado_a,
      categoria,
      costo_proyecto,
      pagado: false // valor por defecto
    });
    res.status(201).json({ message: 'Proyecto creado con éxito', proyecto });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
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
    const { titulo, descripcion, completada, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto, pagado } = req.body;

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
      pagado
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
