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
    },

    // Actualizar cantidad (aumentar o restar)
    updateCantidad: (id, delta, callback) => {
        const sql = 'UPDATE componentes SET cantidad = cantidad + ? WHERE id = ? AND cantidad + ? >= 0';
        db.run(sql, [delta, id, delta], function(err) {
            if (err) {
                return callback(err);
            }
            if (this.changes === 0) {
                return callback(new Error('Componente no encontrado o cantidad no puede ser negativa'));
            }
            // Obtener el componente actualizado
            db.get('SELECT * FROM componentes WHERE id = ?', [id], (err, row) => {
                if (err) return callback(err);
                callback(null, row);
            });
        });
    },

    // Actualizar componente completo
    update: (id, data, callback) => {
        const { tipo_id, marca_modelo, interfaz, capacidad, cantidad, ubicacion_id } = data;
        const sql = `UPDATE componentes SET 
            tipo_id = ?, marca_modelo = ?, interfaz = ?, capacidad = ?, 
            cantidad = ?, ubicacion_id = ? WHERE id = ?`;
        db.run(sql, [tipo_id, marca_modelo, interfaz, capacidad, cantidad, ubicacion_id, id], function(err) {
            if (err) return callback(err);
            if (this.changes === 0) {
                return callback(new Error('Componente no encontrado'));
            }
            db.get('SELECT * FROM componentes WHERE id = ?', [id], (err, row) => {
                if (err) return callback(err);
                callback(null, row);
            });
        });
    },

    // Eliminar componente
    delete: (id, callback) => {
        const sql = 'DELETE FROM componentes WHERE id = ?';
        db.run(sql, [id], function(err) {
            if (err) return callback(err);
            if (this.changes === 0) {
                return callback(new Error('Componente no encontrado'));
            }
            callback(null, { id, deleted: true });
        });
    }
};

export default ComponenteModel;
