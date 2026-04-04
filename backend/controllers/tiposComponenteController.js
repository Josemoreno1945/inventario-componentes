import TiposComponenteModel from '../models/tiposComponenteModel.js';

export const getTiposComponentes = (req, res) => {
    TiposComponenteModel.getAll((err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const createTipoComponente = (req, res, next) => {
  const data = req.validatedBody;
  TiposComponenteModel.create(data, function(err) {
    if (err) return next(err);
    res.json({ id: this.lastID, ...data });
  });
};