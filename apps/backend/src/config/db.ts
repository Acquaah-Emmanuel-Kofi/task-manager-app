import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Error connecting to database", err);
  process.exit(-1);
});

pool.on("connect", () => {
  console.log("Connection pool established with database");
});

export default pool;
