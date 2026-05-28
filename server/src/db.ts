import mysql from 'mysql2/promise';

// 打印所有环境变量用于调试
console.log('DB Variables:', {
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
  MYSQL_URL: process.env.MYSQL_URL ? 'SET' : 'NOT SET',
  MYSQL_HOST: process.env.MYSQL_HOST || process.env['MySQL主机'],
  DB_HOST: process.env.DB_HOST,
});

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

let pool: mysql.Pool;

if (dbUrl) {
  console.log('Using DATABASE_URL');
  pool = mysql.createPool(dbUrl);
} else {
  // 尝试使用 Railway 自动生成的变量名（中文变量名）
  const host = process.env.DB_HOST || process.env['MySQL主机'] || 'localhost';
  const user = process.env.DB_USER || process.env['MySQL用户名'] || 'root';
  const password = process.env.DB_PASSWORD || process.env['MySQL密码'] || 'root';
  const database = process.env.DB_NAME || process.env['MySQL数据库'] || 'roll_call';

  console.log('Using individual vars:', { host, user, database });
  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export default pool;
