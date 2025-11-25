import pool from "../config/db.js";


const User = {

    findByUsername: async (username, pool) => {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0];
    },

    findByEmail: async (email, pool) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    create: async (userData, pool) => {
        const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role';
        const values = [userData.username, userData.password, userData.role];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
};

export default User;