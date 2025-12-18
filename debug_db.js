const pool = require('./server/db');

async function checkSocios() {
  try {
    const res = await pool.query('SELECT * FROM socios');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    // Add a small delay/timeout or just exit mechanism if needed, 
    // but pool.end() is usually enough if the pool is structured that way.
    // However, server/db usually exports a pool instance.
    // We might need to close it to exit cleanly, but for a script it's fine.
    process.exit();
  }
}

checkSocios();
