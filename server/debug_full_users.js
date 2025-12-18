const pool = require('./db');
const dump = async () => {
    try {
        const res = await pool.query("SELECT id, nombre, apellido, rol, account_status FROM socios ORDER BY id DESC");
        console.table(res.rows);
        process.exit(0);
    } catch (err) { console.error(err); process.exit(1); }
};
dump();
