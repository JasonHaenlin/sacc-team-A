const pool = require('../pgsql');

module.exports = {
    createAdmin: async (admin) => {
        const sql = "INSERT INTO admin (email) VALUES ($1);";
        const queryRes = await pool.query(sql, Object.values(admin));
        return queryRes.rows;
    },

    getAdmins: async () => {
        const sql = "SELECT * FROM admin;";
        const queryRes = await pool.query(sql);
        return queryRes.rows;
    },

    getAdmin: async (email) => {
        const sql = "SELECT * FROM admin WHERE email=$1";
        const queryRes = await pool.query(sql, [email]);
        return queryRes.rows[0];
    }
}
