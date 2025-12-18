const pool = require('./db');
const bcrypt = require('bcryptjs');

async function migratePasswords() {
    console.log("Iniciando migración de contraseñas...");
    try {
        const res = await pool.query('SELECT id, password FROM socios');
        const users = res.rows;
        
        for (const user of users) {
            // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                console.log(`Usuario ${user.id} ya tiene contraseña hasheada. Saltando.`);
                continue;
            }
            
            console.log(`Hasheando contraseña para usuario ${user.id}...`);
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await pool.query('UPDATE socios SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
        }
        
        console.log("Migración completada con éxito.");
    } catch (err) {
        console.error("Error durante la migración:", err);
    } finally {
        process.exit();
    }
}

migratePasswords();
