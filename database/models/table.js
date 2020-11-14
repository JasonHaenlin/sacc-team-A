const pool = require('../pgsql');

module.exports = {
    createTables: async () => {
        await createAdminTableIfNotExist();
        await createUserTableIfNotExist();
    },

    deleteTables: async () => {
        await dropAllTables();
    },

    clearTables: async () => {
        await truncateAllTables();
    },
}

createAdminTableIfNotExist = async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS admin (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100) NOT NULL
            );`);
}

createUserTableIfNotExist = async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        sha1 VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        user_status_change_date DATE
    );`);
}

dropAllTables = async () => {
    await pool.query(`DROP TABLE IF EXISTS users, admin;`);
}

truncateAllTables = async () => {
    await pool.query(`TRUNCATE users, admin;`);
}
