import db from "../config/new-database.js";

const ComponenteModel = {
  // Obtener todos los componentes
  getAll: () => {
    const sql =
      "SELECT c.*, tc.nombre AS tipo, u.pasillo, u.estante, u.caja FROM componentes c JOIN tipos_componentes tc ON c.tipo_id = tc.id JOIN ubicaciones u ON c.ubicacion_id = u.id";
    return db.prepare(sql).all();
  },

  // Crear un nuevo componente
  create: (data) => {
    const {
      tipo_id,
      marca_modelo,
      interfaz,
      capacidad,
      cantidad,
      ubicacion_id,
    } = data;
    const sql =
      "INSERT INTO componentes (tipo_id, marca_modelo, interfaz, capacidad, cantidad, ubicacion_id) VALUES (?, ?, ?, ?, ?, ?)";
    const result = db
      .prepare(sql)
      .run(tipo_id, marca_modelo, interfaz, capacidad, cantidad, ubicacion_id);
    return { id: result.lastInsertRowid, ...data };
  },

  // Actualizar cantidad (aumentar o restar)
  updateCantidad: (id, delta) => {
    const sql =
      "UPDATE componentes SET cantidad = cantidad + ? WHERE id = ? AND cantidad + ? >= 0";
    const result = db.prepare(sql).run(delta, id, delta);
    if (result.changes === 0) {
      throw new Error(
        "Componente no encontrado o cantidad no puede ser negativa",
      );
    }
    const componente = db
      .prepare("SELECT * FROM componentes WHERE id = ?")
      .get(id);
    return componente;
  },

  // Actualizar componente completo
  update: (id, data) => {
    const {
      tipo_id,
      marca_modelo,
      interfaz,
      capacidad,
      cantidad,
      ubicacion_id,
    } = data;
    const sql = `UPDATE componentes SET 
            tipo_id = ?, marca_modelo = ?, interfaz = ?, capacidad = ?, 
            cantidad = ?, ubicacion_id = ? WHERE id = ?`;
    const result = db
      .prepare(sql)
      .run(
        tipo_id,
        marca_modelo,
        interfaz,
        capacidad,
        cantidad,
        ubicacion_id,
        id,
      );
    if (result.changes === 0) {
      throw new Error("Componente no encontrado");
    }
    const componente = db
      .prepare("SELECT * FROM componentes WHERE id = ?")
      .get(id);
    return componente;
  },

  // Eliminar componente
  delete: (id) => {
    const result = db.prepare("DELETE FROM componentes WHERE id = ?").run(id);
    if (result.changes === 0) {
      throw new Error("Componente no encontrado");
    }
    return { id, deleted: true };
  },
};

export default ComponenteModel;
