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