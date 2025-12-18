const pool = require('./db');

async function checkSocios() {
  try {
    const res = await pool.query('SELECT * FROM socios');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    // Force exit after a short delay to ensure output is flushed
    setTimeout(() => process.exit(0), 1000);
  }
}

checkSocios();
