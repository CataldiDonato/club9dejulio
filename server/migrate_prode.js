const pool = require('./db');

const migrate = async () => {
  try {
    console.log('Starting migration for Prode module...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
          id SERIAL PRIMARY KEY,
          home_team VARCHAR(100) NOT NULL,
          away_team VARCHAR(100) NOT NULL,
          start_time TIMESTAMP NOT NULL,
          home_score INTEGER,
          away_score INTEGER,
          matchday VARCHAR(50),
          status VARCHAR(20) DEFAULT 'scheduled'
      );
    `);
    console.log('Table "matches" created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS predictions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES socios(id),
          match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
          home_score INTEGER NOT NULL,
          away_score INTEGER NOT NULL,
          points INTEGER DEFAULT 0,
          UNIQUE(user_id, match_id)
      );
    `);
    console.log('Table "predictions" created or already exists.');

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await pool.end();
  }
};

migrate();
