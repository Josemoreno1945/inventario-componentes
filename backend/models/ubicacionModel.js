import db from "../config/new-database.js";

const UbicacionModel = {
  // Obtener todas las ubicaciones
  getAll: () => {
    const sql = "SELECT * FROM ubicaciones";
    return db.prepare(sql).all();
  },

  // Crear una nueva ubicación
  create: (data) => {
    const { pasillo, estante, caja } = data;
    const sql =
      "INSERT INTO ubicaciones (pasillo, estante, caja) VALUES (?, ?, ?)";
    const result = db.prepare(sql).run(pasillo, estante, caja);
    return { id: result.lastInsertRowid, ...data };
  },
};

export default UbicacionModel;
