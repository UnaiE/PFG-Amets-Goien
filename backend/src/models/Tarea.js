import pool from "../config/db.js";

const Tarea = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT t.*, u.username as creado_por_username 
      FROM tareas t 
      LEFT JOIN users u ON t.creado_por = u.id 
      ORDER BY t.created_at DESC
    `);
    return result.rows;
  },

  create: async (tareaData) => {
    const query = `
      INSERT INTO tareas(titulo, descripcion, estado, asignado_a, creado_por)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    const values = [
      tareaData.titulo, 
      tareaData.descripcion, 
      tareaData.estado,
      tareaData.asignado_a || null, 
      tareaData.creado_por || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM tareas WHERE id = $1", [id]);
    return result.rows[0];
  },

  update: async (id, tareaData) => {
    const query = `
      UPDATE tareas SET titulo=$1, descripcion=$2, estado=$3, asignado_a=$4
      WHERE id=$5 RETURNING *;
    `;
    const values = [
      tareaData.titulo, tareaData.descripcion, tareaData.estado,
      tareaData.asignado_a, id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  updateStatus: async (id, estado) => {
    const result = await pool.query(
      "UPDATE tareas SET estado=$1 WHERE id=$2 RETURNING *",
      [estado, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM tareas WHERE id=$1", [id]);
  }
};

export default Tarea;
