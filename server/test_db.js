const pool = require('./db');

async function test() {
  console.log('--- TEST DB START ---');
  try {
    const res = await pool.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
    console.log('Tablas existentes:', res.rows.map(r => r.tablename));
    
    console.log('Intentando verificar relación sponsors...');
    const res2 = await pool.query('SELECT * FROM sponsors LIMIT 1');
    console.log('Query a sponsors exitosa.');
  } catch (err) {
    console.error('ERROR EN TEST:', err.message);
  } finally {
    await pool.end();
    console.log('--- TEST DB END ---');
  }
}

test();
