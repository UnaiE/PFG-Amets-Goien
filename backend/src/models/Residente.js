import pool from '../config/db.js';

const Residente = {
    getAll: async() => {
        const result = await pool.query('SELECT * FROM residentes ORDER BY id DESC');
        return result.rows;
    },
    getById: async(id) => {
        const result = await pool.query('SELECT * FROM residentes WHERE id = $1', [id]);
        return result.rows[0];
    },
    create: async(residenteData) => {
        const query = `INSERT INTO residentes(nombre, apellidos, nacionalidad, fecha_nacimiento, edad, fecha_entrada,
                             fecha_salida, sexo, situacion, anotacion, direccion, enlaces_documentos) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *;`;
        const values = [residenteData.nombre, residenteData.apellidos, residenteData.nacionalidad, residenteData.fecha_nacimiento,residenteData.edad, residenteData.fecha_entrada, residenteData.fecha_salida, residenteData.sexo,residenteData.situacion, residenteData.anotacion, residenteData.direccion, residenteData.enlaces_documentos || null];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    update: async(id, residenteData) => {
        const query = `UPDATE residentes SET nombre=$1, apellidos=$2, nacionalidad=$3, fecha_nacimiento=$4, edad=$5, fecha_entrada=$6, fecha_salida=$7, sexo=$8, situacion=$9, anotacion=$10, direccion=$11, enlaces_documentos=$12 WHERE id=$13 RETURNING *;`;
        const values = [residenteData.nombre, residenteData.apellidos, residenteData.nacionalidad, residenteData.fecha_nacimiento,residenteData.edad, residenteData.fecha_entrada, residenteData.fecha_salida, residenteData.sexo,residenteData.situacion, residenteData.anotacion, residenteData.direccion, residenteData.enlaces_documentos || null, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    delete: async(id) => {
        const result = await pool.query('DELETE FROM residentes WHERE id = $1 RETURNING *;', [id]);
        return result.rows[0];
    }
};

export default Residente;