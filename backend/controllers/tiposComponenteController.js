import TiposComponenteModel from "../models/tiposComponenteModel.js";

export const getTiposComponentes = (req, res) => {
  try {
    const rows = TiposComponenteModel.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTipoComponenteById = (req, res) => {
  try {
    const { id } = req.params;
    const row = TiposComponenteModel.getById(parseInt(id));
    if (!row)
      return res
        .status(404)
        .json({ error: "Tipo de componente no encontrado" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTipoComponente = (req, res) => {
  try {
    const data = req.validatedBody || req.body;
    const result = TiposComponenteModel.create(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTipoComponente = (req, res) => {
  try {
    const { id } = req.params;
    const data = req.validatedBody || req.body;
    const result = TiposComponenteModel.update(parseInt(id), data);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
