import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432, 
  user: process.env.DB_USER || "postgres",
  
  password: process.env.DB_PASSWORD || "12345678", 
  
  database: process.env.DB_NAME || "cloud_engineer", 
});

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(" Kết nối Postgres Windows và khởi tạo Bảng thành công!");
  } catch (err) {
    console.error(" Lỗi Database:", err.message);
  }
};

export default pool;