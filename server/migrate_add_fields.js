const pool = require('./db');

async function migrate() {
  try {
    console.log('Migrating database...');
    
    // Add columns if they don't exist
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='telefono') THEN
            ALTER TABLE socios ADD COLUMN telefono VARCHAR(50);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='email') THEN
            ALTER TABLE socios ADD COLUMN email VARCHAR(100);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='foto_perfil') THEN
            ALTER TABLE socios ADD COLUMN foto_perfil TEXT;
        END IF;
      END $$;
    `);
    
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    setTimeout(() => process.exit(0), 1000);
  }
}

migrate();
