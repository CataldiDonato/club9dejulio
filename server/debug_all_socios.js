const pool = require('./db');

async function dumpAllSocios() {
  try {
    const res = await pool.query('SELECT id, dni, nombre, apellido, nro_socio, vencimiento_cuota FROM socios ORDER BY id');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(() => process.exit(0), 1000);
  }
}

dumpAllSocios();
