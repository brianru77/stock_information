require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT), //숫자로 변환
});

// 연결 확인 (선택적)
pool.connect()
  .then(() => console.log('PostgreSQL 연결 성공!'))
  .catch(err => {
    console.error('❌ PostgreSQL 연결 실패:', err.message);
    process.exit(1);
  });

module.exports = pool;