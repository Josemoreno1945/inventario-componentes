import db from '../config/database.js';

const UbicacionModel = {
    // Obtener todas las ubicaciones
    getAll: (callback) => {
        const sql = 'SELECT * FROM ubicaciones';
        db.all(sql, [], callback);
    },

    // Crear una nueva ubicación
    create: (data, callback) => {
        const { pasillo, estante, caja } = data;
        const sql = 'INSERT INTO ubicaciones (pasillo, estante, caja) VALUES (?, ?, ?)';
        db.run(sql, [pasillo, estante, caja], callback);
    }
};

export default UbicacionModel;