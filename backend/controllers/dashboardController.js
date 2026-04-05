import db from '../config/database.js';

const DashboardController = {
    getStats: (req, res) => {
        // Total componentes y cantidad total
        db.get('SELECT COUNT(*) as totalComponentes, SUM(cantidad) as totalCantidad FROM componentes', [], (err, totals) => {
            if (err) return res.status(500).json({ error: err.message });

            // Por tipo
            db.all(`
                SELECT tc.nombre, COUNT(c.id) as count, SUM(c.cantidad) as totalCantidad 
                FROM componentes c 
                JOIN tipos_componentes tc ON c.tipo_id = tc.id 
                GROUP BY c.tipo_id, tc.nombre 
                ORDER BY count DESC
                LIMIT 5
            `, [], (err, byTipo) => {
                if (err) return res.status(500).json({ error: err.message });

                // Por ubicación (top 5)
                db.all(`
                    SELECT CONCAT(u.pasillo, '-', u.estante, '-', u.caja) as ubicacion, 
                           COUNT(c.id) as count 
                    FROM componentes c 
                    JOIN ubicaciones u ON c.ubicacion_id = u.id 
                    GROUP BY c.ubicacion_id, u.pasillo, u.estante, u.caja 
                    ORDER BY count DESC 
                    LIMIT 5
                `, [], (err, byUbicacion) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Top 10 componentes por cantidad
                    db.all(`
                        SELECT marca_modelo, interfaz, capacidad, cantidad, tc.nombre as tipo 
                        FROM componentes c 
                        JOIN tipos_componentes tc ON c.tipo_id = tc.id 
                        ORDER BY cantidad DESC 
                        LIMIT 10
                    `, [], (err, topComponentes) => {
                        if (err) return res.status(500).json({ error: err.message });

                        // Bajo stock (cantidad < 5)
                        db.all(`
                            SELECT marca_modelo, cantidad, tc.nombre as tipo 
                            FROM componentes c 
                            JOIN tipos_componentes tc ON c.tipo_id = tc.id 
                            WHERE c.cantidad < 5 AND c.cantidad > 0
                            ORDER BY cantidad ASC
                        `, [], (err, lowStock) => {
                            if (err) return res.status(500).json({ error: err.message });

                            res.json({
                                totals: {
                                    totalComponentes: totals.totalComponentes || 0,
                                    totalCantidad: totals.totalCantidad || 0
                                },
                                byTipo: byTipo,
                                byUbicacion: byUbicacion,
                                topComponentes: topComponentes,
                                lowStock: lowStock
                            });
                        });
                    });
                });
            });
        });
    }
};

export default DashboardController;

