const pool = require('../pgsql')

const createUser = async (user) => {
    // await new Promise((resolve, reject) => {
    //     pool.query(`DROP TABLE users;`, [], () => resolve())
    // })
    await new Promise((resolve, reject) => {
        pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            sha1 VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            user_status_change_date DATE
        );`, [], () => resolve())
    })
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO users (sha1, email, user_status_change_date) VALUES ($1, $2, $3);";
        const statement = Object.values(user);
        if (statement.length == 2) statement.push(null)
        pool.query(sql, statement, (err, result) => {
            if (err) {
                reject(err.message);
            }
            resolve(user)
        });
    });
};

const getNumberOfUsers = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) FROM users;";
        pool.query(sql, [], (err, result) => {
            if (err) {
                reject(err.message);
            }
            resolve(result.rows[0].count);
        });
    });
};

const getUser = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users;";
        pool.query(sql, [], (err, result) => {
            if (err) {
                reject(err.message);
            }
            resolve(result.rows);
        });
    });
};

const getNumberOfPoi = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) FROM users WHERE user_status_change_date IS NOT NULL;";
        pool.query(sql, [], (err, result) => {
            if (err) {
                reject(err.message);
            }
            resolve(result.rows[0].count)
        });
    });
};

const getUserSha1 = async (sha1) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE sha1=$1;";
        pool.query(sql, [sha1], (err, result) => {
            if (err) {
                reject(err.message);
            }
            resolve(result.rows[0])
        });
    })
}

const putUser = async (sha1, user) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE users SET sha1 = $1, email = $2, user_status_change_date = $3 WHERE sha1 = $4";
        pool.query(sql, [...Object.values(user), sha1].slice(1), (err, result) => {
            if (err) {
                reject(err.message);
            }
            resolve(user)
        });
    })
}

const deleteAll = async () => {
    return new Promise((resolve, reject) => {
        const sql = "TRUNCATE TABLE users;";
        pool.query(sql, [], (err, result) => {
            if (err) {
                reject(err.message);
            }
            resolve()
        });
    })
}

module.exports = {getNumberOfUsers, getNumberOfPoi, createUser, getUser, getUserSha1, putUser, deleteAll}