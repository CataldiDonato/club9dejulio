const pool = require('./db');

const debug = async () => {
    try {
        const res = await pool.query("SELECT * FROM socios WHERE nombre ILIKE '%juan%' OR apellido ILIKE '%galmarini%'");
        console.log(res.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
