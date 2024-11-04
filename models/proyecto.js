// models/proyecto.js
module.exports = (sequelize, DataTypes) => {
  const Proyecto = sequelize.define('Proyecto', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    completada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      defaultValue: 'media'
    },
    asignado_a: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true
    },
    costo_proyecto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    pagado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    metodo_pago: {
      type: DataTypes.ENUM('stripe', 'cash'),
      allowNull: true
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return Proyecto;
};