const pool = require('./db');

const seed = async () => {
  try {
    console.log('Seeding Prode data...');

    // 1. Create Dummy Users
    const usersData = [
        { dni: '111111', nombre: 'Juan', apellido: 'Perez', nro_socio: 'S001', foto_perfil: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { dni: '222222', nombre: 'Ana', apellido: 'Garcia', nro_socio: 'S002', foto_perfil: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { dni: '333333', nombre: 'Carlos', apellido: 'Lopez', nro_socio: 'S003', foto_perfil: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { dni: '444444', nombre: 'Sofia', apellido: 'Martinez', nro_socio: 'S004', foto_perfil: 'https://randomuser.me/api/portraits/women/4.jpg' },
        { dni: '555555', nombre: 'Miguel', apellido: 'Angel', nro_socio: 'S005', foto_perfil: 'https://randomuser.me/api/portraits/men/5.jpg' }
    ];

    const userIds = [];
    for (const u of usersData) {
        // Upsert user
        const res = await pool.query(`
            INSERT INTO socios (dni, password, nombre, apellido, nro_socio, foto_perfil, tipo_socio, rol)
            VALUES ($1, '1234', $2, $3, $4, $5, 'Activo', 'user')
            ON CONFLICT (dni) DO UPDATE SET nombre = EXCLUDED.nombre
            RETURNING id
        `, [u.dni, u.nombre, u.apellido, u.nro_socio, u.foto_perfil]);
        userIds.push(res.rows[0].id);
        console.log(`User ${u.nombre} seeded.`);
    }

    // 2. Create Matches (3 Finished, 2 Scheduled)
    // Finished
    const m1 = await pool.query("INSERT INTO matches (home_team, away_team, start_time, matchday, status, home_score, away_score) VALUES ('9 de Julio', 'Centenario', NOW() - INTERVAL '3 days', 'Fecha 1', 'finished', 2, 1) RETURNING id");
    const m2 = await pool.query("INSERT INTO matches (home_team, away_team, start_time, matchday, status, home_score, away_score) VALUES ('Belgrano', 'Arteaga', NOW() - INTERVAL '2 days', 'Fecha 1', 'finished', 1, 1) RETURNING id");
    const m3 = await pool.query("INSERT INTO matches (home_team, away_team, start_time, matchday, status, home_score, away_score) VALUES ('Huracán', 'Chañarense', NOW() - INTERVAL '1 day', 'Fecha 1', 'finished', 0, 2) RETURNING id");
    
    // Scheduled (Future)
    await pool.query("INSERT INTO matches (home_team, away_team, start_time, matchday, status) VALUES ('Alianza', 'Independiente', NOW() + INTERVAL '2 days', 'Fecha 2', 'scheduled')");
    await pool.query("INSERT INTO matches (home_team, away_team, start_time, matchday, status) VALUES ('Cafferatense', 'Gödeken', NOW() + INTERVAL '3 days', 'Fecha 2', 'scheduled')");

    console.log('Matches seeded.');

    // 3. Create Predictions
    // Helper to insert
    const predict = async (userId, matchId, h, a, pts) => {
        await pool.query(`
            INSERT INTO predictions (user_id, match_id, home_score, away_score, points)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, match_id) DO NOTHING
        `, [userId, matchId, h, a, pts]);
    };

    // User 1: Juan (Good predictor)
    await predict(userIds[0], m1.rows[0].id, 2, 1, 3); // Exact
    await predict(userIds[0], m2.rows[0].id, 1, 1, 3); // Exact
    await predict(userIds[0], m3.rows[0].id, 0, 1, 1); // Tendency (Away Win)

    // User 2: Ana (Mixed)
    await predict(userIds[1], m1.rows[0].id, 1, 0, 1); // Tendency (Home Win)
    await predict(userIds[1], m2.rows[0].id, 0, 0, 1); // Tendency (Draw)
    await predict(userIds[1], m3.rows[0].id, 1, 2, 0); // Wrong (Home Score 1 vs Real 0 is closer but result was 0-2 away win, she predicted 1-2 away win so it IS tendency? Wait logic check: Pred: 1-2 (AwWin), Real: 0-2 (AwWin). Yes tendency = 1pt)

    // User 3: Carlos (Bad)
    await predict(userIds[2], m1.rows[0].id, 0, 2, 0); // Wrong
    await predict(userIds[2], m2.rows[0].id, 2, 0, 0); // Wrong
    await predict(userIds[2], m3.rows[0].id, 1, 1, 0); // Wrong

    // User 4: Sofia (Trend follower)
    await predict(userIds[3], m1.rows[0].id, 3, 0, 1); 
    await predict(userIds[3], m2.rows[0].id, 2, 2, 1);
    await predict(userIds[3], m3.rows[0].id, 0, 2, 3); // Exact

    console.log('Predictions seeded.');
    console.log('Done!');

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
};

seed();
