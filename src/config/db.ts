import { Pool } from "pg";

console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "SET" : "NOT SET",
});

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "hris_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123",
});

export default pool;