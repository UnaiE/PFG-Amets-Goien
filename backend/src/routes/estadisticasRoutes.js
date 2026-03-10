import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/estadisticas/donaciones-publicas
// Obtener estadisticas publicas de donaciones (solo Redsys completadas)
router.get('/donaciones-publicas', async (req, res) => {
  try {
    // Total recaudado y número de donaciones completadas via Redsys
    const totalQuery = `
      SELECT 
        COUNT(*) as total_donaciones,
        COALESCE(SUM(cantidad), 0) as total_recaudado
      FROM donaciones
      WHERE estado = 'completado'
      AND metodo_pago IN ('redsys_tarjeta', 'redsys_bizum')
    `;
    const totalResult = await pool.query(totalQuery);

    // Desglose por destino
    const desglosQuery = `
      SELECT 
        COALESCE(destino, 'general') as destino,
        COUNT(*) as cantidad_donaciones,
        COALESCE(SUM(cantidad), 0) as total_destino
      FROM donaciones
      WHERE estado = 'completado'
      AND metodo_pago IN ('redsys_tarjeta', 'redsys_bizum')
      GROUP BY destino
      ORDER BY total_destino DESC
    `;
    const desglosResult = await pool.query(desglosQuery);

    res.json({
      total_recaudado: parseFloat(totalResult.rows[0].total_recaudado),
      total_donaciones: parseInt(totalResult.rows[0].total_donaciones),
      desglose_por_destino: desglosResult.rows.map(row => ({
        destino: row.destino || 'general',
        cantidad_donaciones: parseInt(row.cantidad_donaciones),
        total: parseFloat(row.total_destino),
        porcentaje: totalResult.rows[0].total_recaudado > 0 
          ? ((parseFloat(row.total_destino) / parseFloat(totalResult.rows[0].total_recaudado)) * 100).toFixed(1)
          : 0
      }))
    });
  } catch (error) {
    console.error('Error al obtener estadísticas públicas:', error);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

export default router;
