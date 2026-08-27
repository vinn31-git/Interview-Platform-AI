require('dotenv').config();
const { Pool, neonConfig } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

async function run() {
  console.log("Connecting to Neon over WebSockets...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema_utf8.sql'), 'utf-8');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    console.log(`Found ${statements.length} statements to execute.`);
    for (const stmt of statements) {
       await pool.query(stmt);
    }
    console.log("Schema applied successfully!");
  } catch (e) {
    console.error("Error applying schema:", e);
  } finally {
    await pool.end();
  }
}

run();
