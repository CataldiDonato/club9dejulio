const pool = require('./db');

const migrate = async () => {
    try {
        console.log('Iniciando migración de aprobación de usuarios...');
        
        // 1. Add column if not exists
        await pool.query(`
            ALTER TABLE socios 
            ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'pending';
        `);
        console.log('Columna account_status agregada.');

        // 2. Backfill existing users as 'approved'
        // This ensures current users (including admin) don't get locked out
        await pool.query(`
            UPDATE socios 
            SET account_status = 'approved' 
            WHERE account_status IS NULL OR account_status = 'pending';
        `);
        console.log('Usuarios existentes marcados como aprobados.');

        console.log('Migración completada con éxito.');
        process.exit(0);
    } catch (err) {
        console.error('Error durante la migración:', err);
        process.exit(1);
    }
};

migrate();
