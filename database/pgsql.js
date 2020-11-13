const pg = require('pg')

const dev = {
    max: 1,
    user: process.env.PGSQL_USER,
    host: process.env.PGSQL_HOST,
    database: process.env.PGSQL_DATABASE,
    password: process.env.PGSQL_PASSWORD,
}

const prod = {
    max: 1,
    user: process.env.CLOUD_USER,
    host: `/cloudsql/${process.env.CLOUD_CONNECTION_NAME}`,
    database: process.env.CLOUD_DATABASE,
    password: process.env.CLOUD_PASSWORD,
}

if (process.env.NODE_ENV == "dev") module.exports = new pg.Pool(dev);
else module.exports = new pg.Pool(prod)