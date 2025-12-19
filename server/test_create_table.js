const pool = require('./db');

async function create() {
  console.log('--- FORCING TABLE CREATION ---');
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS sponsors (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        imagen_url TEXT NOT NULL,
        link TEXT,
        ubicacion VARCHAR(20) DEFAULT 'footer',
        activo BOOLEAN DEFAULT TRUE,
        clics INTEGER DEFAULT 0,
        fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('QUERY EXECUTED SUCCESSFULLY');
    
    const check = await pool.query('SELECT tablename FROM pg_catalog.pg_tables WHERE tablename = \'sponsors\'');
    if (check.rows.length > 0) {
      console.log('Sponsors table exists now!');
    } else {
      console.log('Query finished but table is NOT there!?');
    }
  } catch (err) {
    console.error('ERROR CREATING TABLE:', err.message);
  } finally {
    await pool.end();
  }
}

create();
