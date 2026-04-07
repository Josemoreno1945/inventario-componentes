import Database from "better-sqlite3";

const db = new Database("./inventario.sqlite");

const initDB = () => {
  const createUbicacionesTable = `
        CREATE TABLE IF NOT EXISTS ubicaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pasillo TEXT NOT NULL,
            estante TEXT NOT NULL,
            caja TEXT NOT NULL
        )
    `;

  const createTiposTable = `
        CREATE TABLE IF NOT EXISTS tipos_componentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
        )
    `;

  const createComponentesTable = `
        CREATE TABLE IF NOT EXISTS componentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_id INTEGER NOT NULL,
            marca_modelo TEXT NOT NULL,
            interfaz TEXT,
            capacidad TEXT,
            cantidad INTEGER DEFAULT 0,
            ubicacion_id INTEGER NOT NULL,
            FOREIGN KEY (tipo_id) REFERENCES tipos_componentes(id),
            FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id)
        )
    `;

  db.exec(createUbicacionesTable);
  db.exec(createTiposTable);
  db.exec(createComponentesTable);
  console.log("Tablas inicializadas correctamente.");
};

initDB();

export default db;
