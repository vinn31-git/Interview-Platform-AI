require('dotenv').config();
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
neonConfig.webSocketConstructor = ws;

async function main() {
  console.log("URL length:", process.env.DATABASE_URL.length);
  
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    console.log("Connected to neon pool directly");
    client.release();
  } catch(e) {
    console.error("Pool error:", e);
  }
}
main();
