const pool = require('./db');

const migrate = async () => {
    try {
        console.log('Adding season column to matches...');
        await pool.query(`
            ALTER TABLE matches 
            ADD COLUMN IF NOT EXISTS season VARCHAR(10) DEFAULT '2025';
        `);
        console.log('Season column added directly.');
        
        // Update existing dummy data to 2025 (or current year) just in case
        await pool.query("UPDATE matches SET season = '2025' WHERE season IS NULL");
        console.log('Migration complete.');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        pool.end();
    }
};

migrate();
