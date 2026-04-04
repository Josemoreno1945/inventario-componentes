import db from '../config/database.js';

const ComponenteModel = {
    // Obtener todos los componentes
    getAll: (callback) => {
        const sql = 'SELECT c.*, tc.nombre AS tipo, u.pasillo, u.estante, u.caja FROM componentes c JOIN tipos_componentes tc ON c.tipo_id = tc.id JOIN ubicaciones u ON c.ubicacion_id = u.id';
        db.all(sql, [], callback);
    },

    // Crear un nuevo componente
    create: (data, callback) => {
        const { tipo_id, marca_modelo, interfaz, capacidad, cantidad, ubicacion_id } = data;
        const sql = 'INSERT INTO componentes (tipo_id, marca_modelo, interfaz, capacidad, cantidad, ubicacion_id) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(sql, [tipo_id, marca_modelo, interfaz, capacidad, cantidad, ubicacion_id], callback);
    }
};

export default ComponenteModel;