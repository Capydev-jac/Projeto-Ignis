import { Pool } from "pg";
import dotenv from "dotenv";


console.log("PGPASSWORD:", process.env.PGPASSWORD);
console.log("Tipo de PGPASSWORD:", typeof process.env.PGPASSWORD);

dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database:"postgres",
  password:"123",
  port: 5432,
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
