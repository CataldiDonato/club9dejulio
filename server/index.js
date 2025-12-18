const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path'); // Se declara una sola vez acá
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Definimos el puerto
const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_only_for_local_dev';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET no definidos en .env para producción");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

// Configurar Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- RUTAS DE LA API ---

// 1. Login Endpoint
app.post('/api/login', async (req, res) => {
  const { dni, password } = req.body;
  
  if (!dni || !password) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM socios WHERE dni = $1 AND password = $2',
      [dni, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      delete user.password; 
      const token = jwt.sign({ id: user.id, dni: user.dni }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ success: true, user, token });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// 2. Register Endpoint
app.post('/api/register', upload.single('foto_perfil'), async (req, res) => {
  const { dni, password, nombre, apellido, nro_socio, tipo_socio, email, telefono } = req.body;
  // Nota: En producción, 'localhost' en la URL de la imagen podría no funcionar para usuarios externos.
  // Idealmente usarías req.get('host') o una variable de entorno, pero lo dejamos así para que funcione ahora.
  const foto_perfil = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;
  
  if (!dni || !password || !nombre || !apellido || !nro_socio) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const userCheck = await pool.query('SELECT * FROM socios WHERE dni = $1', [dni]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'El DNI ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO socios (dni, password, nombre, apellido, nro_socio, tipo_socio, email, telefono, foto_perfil, rol, fecha_alta, estado_cuota, vencimiento_cuota, account_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'user', CURRENT_DATE, 'Al Día', CURRENT_DATE + INTERVAL '1 month', 'pending') RETURNING *",
      [dni, hashedPassword, nombre, apellido, nro_socio, tipo_socio || 'Activo', email, telefono, foto_perfil]
    );
    
    const user = newUser.rows[0];
    delete user.password;
    const token = jwt.sign({ id: user.id, dni: user.dni }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, user, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// 3. News Endpoints
app.get('/api/noticias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM noticias ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

app.post('/api/noticias', authenticateToken, upload.single('imagen'), async (req, res) => {
  try {
    const userResult = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
    }

    const { titulo, bajad, contenido } = req.body;
    const imagen_url = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : req.body.imagen_url;

    const newNews = await pool.query(
      'INSERT INTO noticias (titulo, bajad, contenido, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, bajad, contenido, imagen_url]
    );
    res.json(newNews.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear noticia' });
  }
});

app.delete('/api/noticias/:id', authenticateToken, async (req, res) => {
   try {
    const userResult = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }
    
    const { id } = req.params;
    await pool.query('DELETE FROM noticias WHERE id = $1', [id]);
    res.json({ success: true });
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: 'Error al eliminar noticia' });
   }
});

app.get('/api/noticias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM noticias WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Noticia no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener noticia' });
  }
});

// 4. Sports Endpoints
app.get('/api/deportes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deportes ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener deportes' });
  }
});

app.post('/api/deportes', authenticateToken, upload.single('imagen'), async (req, res) => {
   try {
    const userResult = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }
    
    const { nombre, dia_horario, profesor, descripcion } = req.body;
    const imagen_url = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : req.body.imagen_url;

    const newSport = await pool.query(
      'INSERT INTO deportes (nombre, dia_horario, profesor, descripcion, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, dia_horario, profesor, descripcion, imagen_url]
    );
    res.json(newSport.rows[0]);
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: 'Error al crear deporte' });
   }
});

app.delete('/api/deportes/:id', authenticateToken, async (req, res) => {
   try {
    const userResult = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }
    
    const { id } = req.params;
    await pool.query('DELETE FROM deportes WHERE id = $1', [id]);
    res.json({ success: true });
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: 'Error al eliminar deporte' });
   }
});

// 5. User & Admin Endpoints
app.put('/api/me/update', authenticateToken, upload.single('foto_perfil'), async (req, res) => {
  try {
    const { telefono, email } = req.body;
    const userId = req.user.id;
    
    const currentUserRes = await pool.query('SELECT foto_perfil FROM socios WHERE id = $1', [userId]);
    const currentPhoto = currentUserRes.rows[0].foto_perfil;
    
    const foto_perfil = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : (req.body.foto_perfil || currentPhoto); 

    const result = await pool.query(
      'UPDATE socios SET telefono = $1, email = $2, foto_perfil = $3 WHERE id = $4 RETURNING *',
      [telefono, email, foto_perfil, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updatedUser = result.rows[0];
    delete updatedUser.password;
    res.json({ success: true, user: updatedUser });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al actualizar datos' });
  }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        const userResult = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }
        
        const result = await pool.query('SELECT id, nombre, apellido, dni, nro_socio, account_status, email, telefono, foto_perfil, rol FROM socios ORDER BY account_status DESC, fecha_alta DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.put('/api/admin/users/:id/status', authenticateToken, async (req, res) => {
    try {
        const userResult = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }
        
        const { id } = req.params;
        const { status } = req.body; 
        
        const result = await pool.query('UPDATE socios SET account_status = $1 WHERE id = $2 RETURNING *', [status, id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating user status' });
    }
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
    try {
        const userResult = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }

        const { id } = req.params;
        if (parseInt(id) === req.user.id) {
             return res.status(400).json({ error: 'No puedes eliminarte a ti mismo.' });
        }

        await pool.query('DELETE FROM socios WHERE id = $1', [id]);
        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

app.get('/api/socios/:id?', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id || req.user.id;
    const result = await pool.query('SELECT id, dni, nombre, apellido, nro_socio, tipo_socio, email, telefono, foto_perfil, rol, account_status, fecha_alta, estado_cuota, vencimiento_cuota FROM socios WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    
    if (id !== req.user.id) {
        const userRes = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
        if (userRes.rows[0].rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// 6. Prode Endpoints
const calculatePoints = (predHome, predAway, realHome, realAway) => {
    if (predHome === realHome && predAway === realAway) return 3;
    const predDiff = predHome - predAway;
    const realDiff = realHome - realAway;
    if (Math.sign(predDiff) === Math.sign(realDiff)) return 1;
    return 0;
};

app.get('/api/matches', authenticateToken, async (req, res) => {
  try {
    const { season } = req.query;
    let query = 'SELECT * FROM matches';
    const params = [];

    if (season) {
        query += ' WHERE season = $1';
        params.push(season);
    }
    
    query += ' ORDER BY start_time ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching matches' });
  }
});

app.post('/api/matches', authenticateToken, async (req, res) => {
    try {
        const userResult = await pool.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }

        const { home_team, away_team, start_time, matchday, season } = req.body;
        const newMatch = await pool.query(
            'INSERT INTO matches (home_team, away_team, start_time, matchday, season) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [home_team, away_team, start_time, matchday, season || new Date().getFullYear().toString()]
        );
        res.json(newMatch.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating match' });
    }
});

app.put('/api/matches/:id/result', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        const userResult = await client.query('SELECT rol FROM socios WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0 || userResult.rows[0].rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }

        const { id } = req.params;
        const { home_score, away_score } = req.body;

        await client.query('BEGIN');

        const matchRes = await client.query(
            "UPDATE matches SET home_score = $1, away_score = $2, status = 'finished' WHERE id = $3 RETURNING *",
            [home_score, away_score, id]
        );
        
        if (matchRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Partido no encontrado' });
        }

        const predsRes = await client.query('SELECT * FROM predictions WHERE match_id = $1', [id]);
        const predictions = predsRes.rows;

        for (const pred of predictions) {
            const points = calculatePoints(pred.home_score, pred.away_score, home_score, away_score);
            await client.query('UPDATE predictions SET points = $1 WHERE id = $2', [points, pred.id]);
        }

        await client.query('COMMIT');
        res.json({ success: true, match: matchRes.rows[0], processed_predictions: predictions.length });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error updating result' });
    } finally {
        client.release();
    }
});

app.get('/api/predictions/my', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM predictions WHERE user_id = $1', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching predictions' });
    }
});

app.post('/api/predictions', authenticateToken, async (req, res) => {
    try {
        const { match_id, home_score, away_score } = req.body;
        const user_id = req.user.id;

        const userStatus = await pool.query('SELECT account_status FROM socios WHERE id = $1', [user_id]);
        if (userStatus.rows.length === 0 || userStatus.rows[0].account_status !== 'approved') {
             return res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación. No puedes realizar acciones aún.' });
        }

        const matchRes = await pool.query('SELECT start_time FROM matches WHERE id = $1', [match_id]);
        if (matchRes.rows.length === 0) return res.status(404).json({ error: 'Partido no encontrado' });
        
        const startTime = new Date(matchRes.rows[0].start_time);
        const now = new Date();
        const lockTime = new Date(startTime.getTime() - 2 * 60 * 60 * 1000); 

        if (now >= lockTime) {
            return res.status(400).json({ error: 'El partido ya comenzó o está por comenzar. No se pueden cambiar pronósticos.' });
        }

        const result = await pool.query(`
            INSERT INTO predictions (user_id, match_id, home_score, away_score)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, match_id) 
            DO UPDATE SET home_score = EXCLUDED.home_score, away_score = EXCLUDED.away_score
            RETURNING *
        `, [user_id, match_id, home_score, away_score]);

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error submitting prediction' });
    }
});

app.get('/api/ranking', async (req, res) => {
    try {
        const { season } = req.query;
        let seasonFilter = '';
        const params = [];

        if (season) {
            seasonFilter = 'AND m.season = $1';
            params.push(season);
        }

        const query = `
            SELECT 
                s.nombre, 
                s.apellido, 
                s.foto_perfil,
                SUM(p.points) as total_points,
                COUNT(CASE WHEN p.points = 3 THEN 1 END) as plenos
            FROM predictions p
            JOIN socios s ON p.user_id = s.id
            JOIN matches m ON p.match_id = m.id
            WHERE m.status = 'finished' ${seasonFilter}
            GROUP BY s.id, s.nombre, s.apellido, s.foto_perfil
            ORDER BY total_points DESC, plenos DESC
        `;
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching ranking' });
    }
});

app.get('/api/seasons', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT season FROM matches ORDER BY season DESC');
        res.json(result.rows.map(r => r.season));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching seasons' });
    }
});

// --- INTEGRACIÓN FRONTEND (LO QUE TE FALTABA PARA QUE ANDE LA WEB) ---
// 1. Decirle a Express que la carpeta '../dist' tiene los archivos estáticos de la web
app.use(express.static(path.join(__dirname, '../dist')));

// 2. Cualquier ruta que no sea de la API, devuelve el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});