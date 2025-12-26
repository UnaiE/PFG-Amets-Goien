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
    const { colaborador_id, importe, metodo_pago, stripe_payment_intent_id, estado } = data;
    const result = await pool.query(
      `INSERT INTO donaciones (colaborador_id, importe, metodo_pago, stripe_payment_intent_id, estado, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [colaborador_id, importe, metodo_pago, stripe_payment_intent_id, estado || 'pendiente']
    );
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

  static async getByPaymentIntentId(paymentIntentId) {
    const result = await pool.query(
      'SELECT * FROM donaciones WHERE stripe_payment_intent_id = $1',
      [paymentIntentId]
    );
    return result.rows[0];
  }
}

export default Donacion;
