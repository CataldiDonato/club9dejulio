const pool = require('./db');

async function checkMatches() {
    try {
        const res = await pool.query("SELECT * FROM matches WHERE home_team = '9 de julio' OR away_team = '9 de julio' ORDER BY start_time DESC LIMIT 5");
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkMatches();
