import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

let pool: mysql.Pool;

if (dbUrl) {
  pool = mysql.createPool(dbUrl);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'db_student',
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export default pool;
