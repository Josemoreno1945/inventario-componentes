import ComponenteModel from '../models/componenteModel.js';

export const getComponentes = (req, res) => {
    ComponenteModel.getAll((err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const createComponente = (req, res, next) => {
  const data = req.validatedBody;

  ComponenteModel.create(data, function(err) {
    if (err) return next(err);
    res.json({ id: this.lastID, ...data });
  });
};

// Actualizar cantidad de componente
export const updateCantidad = (req, res, next) => {
  const { id } = req.params;
  const { delta } = req.body;

  if (typeof delta !== 'number' || isNaN(delta)) {
    return res.status(400).json({ error: 'Delta debe ser un número válido' });
  }

  ComponenteModel.updateCantidad(parseInt(id), parseInt(delta), (err, componente) => {
    if (err) return next(err);
    res.json({
      message: 'Cantidad actualizada exitosamente',
      componente
    });
  });
};

// Actualizar componente completo
export const updateComponente = (req, res, next) => {
  const { id } = req.params;
  const data = req.validatedBody || req.body; // Flexible para validación

  ComponenteModel.update(parseInt(id), data, (err, componente) => {
    if (err) return next(err);
    res.json({
      message: 'Componente actualizado exitosamente',
      componente
    });
  });
};

// Eliminar componente
export const deleteComponente = (req, res, next) => {
  const { id } = req.params;

  ComponenteModel.delete(parseInt(id), (err, result) => {
    if (err) return next(err);
    res.json({
      message: 'Componente eliminado exitosamente',
      result
    });
  });
};
