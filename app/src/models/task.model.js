import pool from "../config/db.js";

export const createTask = async (title) => {
  const result = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title]
  );
  return result.rows[0];
};

export const getTasks = async () => {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY id DESC"
  );
  return result.rows;
};


export const deleteTask = async (id) => {
     const result = await pool.query(
       "DELETE FROM tasks WHERE id = $1 RETURNING *",
       [id]
     );
     return result.rows[0];
   };