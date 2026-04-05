import db from '../config/database.js';

const TiposComponenteModel = {



    // Obtener todos los tipos de componentes
    getAll: (callback) => {
        const sql = 'SELECT * FROM tipos_componentes';
        db.all(sql, [], callback);
    },

    // Obtener un tipo por ID
    getById: (id, callback) => {
        const sql = 'SELECT * FROM tipos_componentes WHERE id = ?';
        db.get(sql, [id], callback);
    },

    // Crear un nuevo tipo de componente
    create: (data, callback) => {
        const { nombre } = data;
        const sql = 'INSERT INTO tipos_componentes (nombre) VALUES (?)';
        db.run(sql, [nombre], callback);
    },

    // Actualizar tipo de componente
    update: (id, data, callback) => {
        const { nombre } = data;
        const sql = 'UPDATE tipos_componentes SET nombre = ? WHERE id = ?';
        db.run(sql, [nombre, id], callback);
    },

    

};

export default TiposComponenteModel;
