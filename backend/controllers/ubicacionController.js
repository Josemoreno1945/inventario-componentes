import UbicacionModel from '../models/ubicacionModel.js';

export const getUbicaciones = (req, res) => {
    UbicacionModel.getAll((err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const createUbicacion = (req, res, next) => {
  const data = req.validatedBody;
  UbicacionModel.create(data, function(err) {
    if (err) return next(err);
    res.json({ id: this.lastID, ...data });
  });
};