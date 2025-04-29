import { Pool } from "pg";
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "123",
    port: 5432,
});
async function query(sql: string, params?: any[]) {
    try {
        const res = await pool.query(sql, params);
        if (res.command == 'INSERT') {
            return res.rows[0];
        }
        else if (res.command == 'SELECT') {
            return res.rows;
        }
        else if (res.command == 'DELETE' || res.command == 'UPDATE') {
            return { rowcount: res.rowCount };
        }
        else {
            return { sql };
        }
    }
    catch (e: any) {
        return { message: e.message };
    }
};
export default pool
export {query}