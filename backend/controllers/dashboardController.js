import db from "../config/new-database.js";

const DashboardController = {
  getStats: (req, res) => {
    try {
      // Total componentes y cantidad total
      const totals = db
        .prepare(
          "SELECT COUNT(*) as totalComponentes, SUM(cantidad) as totalCantidad FROM componentes",
        )
        .get();

      // Por tipo
      const byTipo = db
        .prepare(
          `
                SELECT tc.nombre, COUNT(c.id) as count, SUM(c.cantidad) as totalCantidad 
                FROM componentes c 
                JOIN tipos_componentes tc ON c.tipo_id = tc.id 
                GROUP BY c.tipo_id, tc.nombre 
                ORDER BY count DESC
                LIMIT 5
            `,
        )
        .all();

      // Por ubicación (top 5)
      const byUbicacion = db
        .prepare(
          `
                SELECT CONCAT(u.pasillo, '-', u.estante, '-', u.caja) as ubicacion, 
                       COUNT(c.id) as count 
                FROM componentes c 
                JOIN ubicaciones u ON c.ubicacion_id = u.id 
                GROUP BY c.ubicacion_id, u.pasillo, u.estante, u.caja 
                ORDER BY count DESC 
                LIMIT 5
            `,
        )
        .all();

      // Top 10 componentes por cantidad
      const topComponentes = db
        .prepare(
          `
                SELECT marca_modelo, interfaz, capacidad, cantidad, tc.nombre as tipo 
                FROM componentes c 
                JOIN tipos_componentes tc ON c.tipo_id = tc.id 
                ORDER BY cantidad DESC 
                LIMIT 10
            `,
        )
        .all();

      // Bajo stock (cantidad < 5)
      const lowStock = db
        .prepare(
          `
                SELECT marca_modelo, cantidad, tc.nombre as tipo 
                FROM componentes c 
                JOIN tipos_componentes tc ON c.tipo_id = tc.id 
                WHERE c.cantidad < 5 AND c.cantidad > 0
                ORDER BY cantidad ASC
            `,
        )
        .all();

      res.json({
        totals: {
          totalComponentes: totals.totalComponentes || 0,
          totalCantidad: totals.totalCantidad || 0,
        },
        byTipo: byTipo,
        byUbicacion: byUbicacion,
        topComponentes: topComponentes,
        lowStock: lowStock,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default DashboardController;
