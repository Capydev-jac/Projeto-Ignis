import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

async function query(sql: string, params?: any[]) {
  try {
    const res = await pool.query(sql, params);

    switch (res.command) {
      case "INSERT":
        return res.rows[0];
      case "SELECT":
        return res.rows;
      case "DELETE":
      case "UPDATE":
        return { rowcount: res.rowCount };
      default:
        return { sql };
    }
  } catch (e: any) {
    console.error("Erro na consulta:", e);
    return { message: e.message };
  }
}

export default pool;
export { query };
