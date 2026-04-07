import UbicacionModel from "../models/ubicacionModel.js";

export const getUbicaciones = (req, res) => {
  try {
    const rows = UbicacionModel.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUbicacion = (req, res) => {
  try {
    const data = req.validatedBody || req.body;
    const result = UbicacionModel.create(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
