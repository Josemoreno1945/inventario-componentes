import TiposComponenteModel from '../models/tiposComponenteModel.js';

export const getTiposComponentes = (req, res) => {
    TiposComponenteModel.getAll((err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const getTipoComponenteById = (req, res) => {
    const { id } = req.params;
    TiposComponenteModel.getById(id, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Tipo de componente no encontrado' });
        res.json(row);
    });
};

export const createTipoComponente = (req, res, next) => {
  const data = req.validatedBody;
  TiposComponenteModel.create(data, function(err) {
    if (err) return next(err);
    res.json({ id: this.lastID, ...data });
  });
};

export const updateTipoComponente = (req, res, next) => {
  const { id } = req.params;
  const data = req.validatedBody;
  TiposComponenteModel.update(id, data, function(err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: 'Tipo de componente no encontrado' });
    res.json({ id, ...data });
  });
};






