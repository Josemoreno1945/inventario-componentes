import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();

const db = new sqlite.Database('./inventario.sqlite', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

const initDB = () => {
    // 1. Tabla de Ubicaciones
    const createUbicacionesTable = `
        CREATE TABLE IF NOT EXISTS ubicaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pasillo TEXT NOT NULL,
            estante TEXT NOT NULL,
            caja TEXT NOT NULL
        )
    `;

    // 2. NUEVA TABLA: Tipos de Componentes
    const createTiposTable = `
        CREATE TABLE IF NOT EXISTS tipos_componentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
        )
    `;

    // 3. Tabla de Componentes (Actualizada con tipo_id)
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

    db.serialize(() => {
        db.run(createUbicacionesTable);
        db.run(createTiposTable);
        db.run(createComponentesTable);
        console.log('Tablas inicializadas correctamente.');
    });
};

initDB();

export default db;