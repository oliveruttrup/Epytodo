const mysql = require('mysql2/promise');
const dotenv = require('dotenv');


dotenv.config();

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

async function act(query, params) {
    const conn = await connection;
    const [res,] = await conn.execute(query, params);
    return res;
}

module.exports = {
    act
}
