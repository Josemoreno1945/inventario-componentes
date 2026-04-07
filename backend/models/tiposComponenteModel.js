import db from "../config/new-database.js";

const TiposComponenteModel = {
  // Obtener todos los tipos de componentes
  getAll: () => {
    const sql = "SELECT * FROM tipos_componentes";
    return db.prepare(sql).all();
  },

  // Obtener un tipo por ID
  getById: (id) => {
    const sql = "SELECT * FROM tipos_componentes WHERE id = ?";
    return db.prepare(sql).get(id);
  },

  // Crear un nuevo tipo de componente
  create: (data) => {
    const { nombre } = data;
    const sql = "INSERT INTO tipos_componentes (nombre) VALUES (?)";
    const result = db.prepare(sql).run(nombre);
    return { id: result.lastInsertRowid, nombre };
  },

  // Actualizar tipo de componente
  update: (id, data) => {
    const { nombre } = data;
    const sql = "UPDATE tipos_componentes SET nombre = ? WHERE id = ?";
    const result = db.prepare(sql).run(nombre, id);
    return { id, ...data };
  },
};

export default TiposComponenteModel;
