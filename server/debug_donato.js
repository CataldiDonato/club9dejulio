const pool = require('./db');

async function checkDonato() {
  try {
    // Case insensitive search just in case
    const res = await pool.query("SELECT * FROM socios WHERE upper(nombre) LIKE '%DONATO%' OR upper(apellido) LIKE '%CATALDI%'");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(() => process.exit(0), 1000);
  }
}

checkDonato();
