import ComponenteModel from "../models/componenteModel.js";

export const getComponentes = (req, res) => {
  try {
    const rows = ComponenteModel.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createComponente = (req, res) => {
  try {
    const data = req.validatedBody || req.body;
    const result = ComponenteModel.create(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCantidad = (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;
    const componente = ComponenteModel.updateCantidad(
      parseInt(id),
      parseInt(delta),
    );
    res.json({
      message: "Cantidad actualizada exitosamente",
      componente,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateComponente = (req, res) => {
  try {
    const { id } = req.params;
    const data = req.validatedBody || req.body;
    const componente = ComponenteModel.update(parseInt(id), data);
    res.json({
      message: "Componente actualizado exitosamente",
      componente,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteComponente = (req, res) => {
  try {
    const { id } = req.params;
    const result = ComponenteModel.delete(parseInt(id));
    res.json({ message: "Componente eliminado exitosamente", result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
