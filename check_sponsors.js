const { Pool } = require('pg');
require('dotenv').config({ path: './server/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'club9dejulio',
  password: process.env.DB_PASSWORD || 'donato',
  port: process.env.DB_PORT || 5432,
});

async function checkSponsors() {
  try {
    const res = await pool.query('SELECT * FROM sponsors');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkSponsors();
