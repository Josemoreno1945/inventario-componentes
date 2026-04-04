import db from '../config/database.js';

const TiposComponenteModel = {
    // Obtener todos los tipos de componentes
    getAll: (callback) => {
        const sql = 'SELECT * FROM tipos_componentes';
        db.all(sql, [], callback);
    },

    // Crear un nuevo tipo de componente
    create: (data, callback) => {
        const { nombre } = data;
        const sql = 'INSERT INTO tipos_componentes (nombre) VALUES (?)';
        db.run(sql, [nombre], callback);
    }
};

export default TiposComponenteModel;