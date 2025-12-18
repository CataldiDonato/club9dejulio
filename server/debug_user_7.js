const pool = require('./db');
const debug = async () => {
    try {
        const res = await pool.query("SELECT id, nombre, apellido, rol, account_status FROM socios WHERE id = 7");
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) { console.error(err); process.exit(1); }
};
debug();
