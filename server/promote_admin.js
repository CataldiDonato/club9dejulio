const pool = require('./db');
const fix = async () => {
    try {
        // Check for ANY admin
        const admins = await pool.query("SELECT * FROM socios WHERE rol = 'admin'");
        console.log("Current Admins:", admins.rows.length);

        // Promote ID 7 to admin
        await pool.query("UPDATE socios SET rol = 'admin' WHERE id = 7");
        console.log("User 7 promoted to admin.");
        process.exit(0);
    } catch (err) { console.error(err); process.exit(1); }
};
fix();
