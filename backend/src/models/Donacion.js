import pool from '../config/db.js';

class Donacion {
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM donaciones ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM donaciones WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { 
      colaborador_id, 
      cantidad, 
      metodo_pago, 
      redsys_order_id,
      redsys_auth_code,
      redsys_response_code,
      periodicidad, 
      estado, 
      anotacion,
      metadata
    } = data;
    
    const result = await pool.query(
      `INSERT INTO donaciones (
        colaborador_id, cantidad, metodo_pago, 
        redsys_order_id, redsys_auth_code, redsys_response_code,
        periodicidad, estado, anotacion, created_at
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [
        colaborador_id, 
        cantidad, 
        metodo_pago, 
        redsys_order_id || null,
        redsys_auth_code || null,
        redsys_response_code || null,
        periodicidad || 'puntual', 
        estado || 'completada', 
        // Guardar metadata en la anotación temporalmente hasta que se complete el pago
        metadata ? `${anotacion} [METADATA:${metadata}]` : anotacion
      ]
    );

    const row = result.rows[0];
    
    // Extraer metadata de la anotación si existe
    if (row.anotacion && row.anotacion.includes('[METADATA:')) {
      const metadataMatch = row.anotacion.match(/\[METADATA:(.+)\]$/);
      if (metadataMatch) {
        row.metadata = metadataMatch[1];
        row.anotacion = row.anotacion.replace(/\s*\[METADATA:.+\]$/, '');
      }
    }
    
    return row;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Construir dinámicamente la query UPDATE
    Object.keys(data).forEach(key => {
      fields.push(`${key} = $${paramCount}`);
      values.push(data[key]);
      paramCount++;
    });

    // Añadir updated_at
    fields.push(`updated_at = NOW()`);

    // Añadir el ID al final
    values.push(id);

    const query = `
      UPDATE donaciones 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateEstado(id, estado) {
    const result = await pool.query(
      `UPDATE donaciones 
       SET estado = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [estado, id]
    );
    return result.rows[0];
  }

  static async findByRedsysOrderId(orderId) {
    const result = await pool.query(
      'SELECT * FROM donaciones WHERE redsys_order_id = $1',
      [orderId]
    );
    const row = result.rows[0];
    
    // Extraer metadata de la anotación si existe
    if (row && row.anotacion && row.anotacion.includes('[METADATA:')) {
      const metadataMatch = row.anotacion.match(/\[METADATA:(.+)\]$/);
      if (metadataMatch) {
        row.metadata = metadataMatch[1];
        // No eliminar el metadata de la anotación aquí, se hará en el webhook
      }
    }
    
    return row;
  }

  static async expireOldPending(minutes = 120) {
    const result = await pool.query(
      `UPDATE donaciones
       SET estado = 'expirada',
           updated_at = NOW(),
           anotacion = CASE
             WHEN anotacion IS NULL OR anotacion = '' THEN $1::text
             ELSE CONCAT(anotacion, ' | ', $1::text)
           END
       WHERE estado = 'pendiente'
         AND created_at < NOW() - ($2::int * INTERVAL '1 minute')
       RETURNING id`,
      [
        'Expirada automaticamente por tiempo sin confirmacion de pago',
        minutes
      ]
    );

    return {
      count: result.rowCount,
      ids: result.rows.map(row => row.id)
    };
  }

  static async deleteOldTransient({ expiradaHours = 24, fallidaHours = 72 } = {}) {
    const result = await pool.query(
      `DELETE FROM donaciones
       WHERE (
         estado = 'expirada'
         AND COALESCE(updated_at, created_at) < NOW() - ($1::int * INTERVAL '1 hour')
       )
       OR (
         estado = 'fallida'
         AND COALESCE(updated_at, created_at) < NOW() - ($2::int * INTERVAL '1 hour')
       )
       RETURNING id, estado`,
      [expiradaHours, fallidaHours]
    );

    const deletedByState = result.rows.reduce(
      (acc, row) => {
        if (row.estado === 'expirada') acc.expirada += 1;
        if (row.estado === 'fallida') acc.fallida += 1;
        return acc;
      },
      { expirada: 0, fallida: 0 }
    );

    return {
      count: result.rowCount,
      deletedByState,
      ids: result.rows.map(row => row.id)
    };
  }
}

export default Donacion;
