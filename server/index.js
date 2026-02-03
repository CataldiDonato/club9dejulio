const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const pool = require("./db");

const TEAMS = [
  '9 de julio',
  'Alianza',
  'Arteaga',
  'Belgrano',
  'Cafferata',
  'Centenario',
  'Chañarense',
  'Deportivo',
  'Federacion',
  'Godeken',
  'Huracan',
  'Independiente',
  'Defensores de Armstrong',
  'Unión de Cruz Alta'
];
const multer = require("multer");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const { optimizeImage, saveOptimizedImage } = require("./lib/imageOptimizer");

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || "dev_secret_only_for_local_dev";

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET no definidos en .env para producción");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Servir Estáticos (Uploads) - Ruta única y absoluta
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Configurar Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- RUTAS DE LA API ---

app.post("/api/login", async (req, res) => {
  const { dni, password } = req.body;
  if (!dni || !password) return res.status(400).json({ error: "Faltan datos" });
  try {
    const result = await pool.query("SELECT * FROM socios WHERE dni = $1", [
      dni,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ error: "Credenciales inválidas" });
      delete user.password;
      const token = jwt.sign({ id: user.id, dni: user.dni }, SECRET_KEY);
      res.json({ success: true, user, token });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.post("/api/register", upload.single("foto_perfil"), async (req, res) => {
  const {
    dni,
    password,
    nombre,
    apellido,
    nro_socio,
    tipo_socio,
    email,
    telefono,
    fecha_nacimiento,
  } = req.body;

  let foto_perfil = null;
  if (req.file) {
    try {
      const buffer = await optimizeImage(req.file.path, 'profile');
      foto_perfil = await saveOptimizedImage(buffer, req.file.path);
    } catch (error) {
      console.error("Error optimizando imagen de perfil:", error);
      foto_perfil = `/uploads/${req.file.filename}`;
    }
  }
  if (!dni || !password || !nombre || !apellido || !fecha_nacimiento)
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  const finalNroSocio = nro_socio && nro_socio.trim() !== "" ? nro_socio : null;
  try {
    const userCheck = await pool.query("SELECT * FROM socios WHERE dni = $1", [
      dni,
    ]);
    if (userCheck.rows.length > 0)
      return res.status(409).json({ error: "El DNI ya está registrado" });
    if (finalNroSocio) {
      const socioCheck = await pool.query(
        "SELECT * FROM socios WHERE nro_socio = $1",
        [finalNroSocio]
      );
      if (socioCheck.rows.length > 0)
        return res
          .status(409)
          .json({ error: "El Número de Socio ya está registrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO socios (dni, password, nombre, apellido, nro_socio, tipo_socio, email, telefono, foto_perfil, rol, fecha_alta, estado_cuota, vencimiento_cuota, account_status, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'user', CURRENT_DATE, 'Al Día', CURRENT_DATE + INTERVAL '1 month', 'pending', $10) RETURNING *",
      [
        dni,
        hashedPassword,
        nombre,
        apellido,
        finalNroSocio,
        tipo_socio || "Activo",
        email,
        telefono,
        foto_perfil,
        fecha_nacimiento,
      ]
    );
    const user = newUser.rows[0];
    delete user.password;
    const token = jwt.sign({ id: user.id, dni: user.dni }, SECRET_KEY);
    res.json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

app.get("/api/noticias", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM noticias ORDER BY fecha DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener noticias" });
  }
});

/* NOTICIAS (Ahora con múltiples imágenes) */

// GET News Detail with images
app.get("/api/noticias/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM noticias WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Noticia no encontrada" });

    const imagenes = await pool.query(
      "SELECT imagen_url FROM noticias_imagenes WHERE noticia_id = $1",
      [id]
    );

    const noticia = result.rows[0];
    noticia.imagenes = imagenes.rows.map((row) => row.imagen_url);

    res.json(noticia);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener noticia" });
  }
});

// -----------------------------------------------------------------------------
// POST /api/noticias
// -----------------------------------------------------------------------------
app.post(
  "/api/noticias",
  authenticateToken,
  upload.array("imagenes", 10),
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (
        userResult.rows.length === 0 ||
        (userResult.rows[0].rol !== "admin" && userResult.rows[0].rol !== "representante")
      )
        return res.status(403).json({ error: "Acceso denegado." });
      const { titulo, bajad, contenido, fecha } = req.body;

      let main_image_url = null;
      let other_images = [];

      if (req.files && req.files.length > 0) {
        const processedImages = await Promise.all(req.files.map(async (file) => {
          try {
            const buffer = await optimizeImage(file.path, 'gallery');
            return await saveOptimizedImage(buffer, file.path);
          } catch (error) {
            console.error(`Error optimizando imagen noticia ${file.originalname}:`, error);
            return `/uploads/${file.filename}`;
          }
        }));
        main_image_url = processedImages[0];
        other_images = processedImages.slice(1);
      }

      // Insert News
      const finalFecha = (fecha && fecha !== "undefined" && fecha.trim() !== "") ? fecha : null;
      const finalBajad = (bajad === "undefined") ? null : bajad;
      const finalContenido = (contenido === "undefined") ? null : contenido;

      const newNews = await pool.query(
        "INSERT INTO noticias (titulo, bajad, contenido, imagen_url, fecha) VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_TIMESTAMP)) RETURNING *",
        [titulo, finalBajad || null, finalContenido || null, main_image_url, finalFecha]
      );

      const noticiaId = newNews.rows[0].id;

      // Insert Extra Images
      for (const imgUrl of other_images) {
        await pool.query(
          "INSERT INTO noticias_imagenes (noticia_id, imagen_url) VALUES ($1, $2)",
          [noticiaId, imgUrl]
        );
      }

      res.json(newNews.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear noticia" });
    }
  }
);

// -----------------------------------------------------------------------------
// DELETE /api/noticias/:id
// -----------------------------------------------------------------------------
app.delete("/api/noticias/:id", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (
      userResult.rows.length === 0 ||
      (userResult.rows[0].rol !== "admin" && userResult.rows[0].rol !== "representante")
    )
      return res.status(403).json({ error: "Acceso denegado." });
    const { id } = req.params;
    await pool.query("DELETE FROM noticias WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar noticia" });
  }
});

// -----------------------------------------------------------------------------
// PUT /api/noticias/:id
// -----------------------------------------------------------------------------
app.put(
  "/api/noticias/:id",
  authenticateToken,
  upload.array("imagenes", 10),
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (
        userResult.rows.length === 0 ||
        (userResult.rows[0].rol !== "admin" && userResult.rows[0].rol !== "representante")
      )
        return res.status(403).json({ error: "Acceso denegado." });

      const { id } = req.params;
      const { titulo, bajad, contenido, fecha } = req.body;

      // Obtener noticia actual
      const currentNews = await pool.query(
        "SELECT imagen_url FROM noticias WHERE id = $1",
        [id]
      );
      if (currentNews.rows.length === 0)
        return res.status(404).json({ error: "Noticia no encontrada" });

      let main_image_url = currentNews.rows[0].imagen_url;
      let other_images = [];

      if (req.files && req.files.length > 0) {
        const processedImages = await Promise.all(req.files.map(async (file) => {
          try {
            const buffer = await optimizeImage(file.path, 'gallery');
            return await saveOptimizedImage(buffer, file.path);
          } catch (error) {
            console.error(`Error optimizando imagen noticia ${file.originalname}:`, error);
            return `/uploads/${file.filename}`;
          }
        }));
        main_image_url = processedImages[0];
        other_images = processedImages.slice(1);

        // Si hay nuevas imágenes, actualizamos las secundarias también
        await pool.query(
          "DELETE FROM noticias_imagenes WHERE noticia_id = $1",
          [id]
        );
        for (const imgUrl of other_images) {
          await pool.query(
            "INSERT INTO noticias_imagenes (noticia_id, imagen_url) VALUES ($1, $2)",
            [id, imgUrl]
          );
        }
      }

      const finalFecha = (fecha && fecha !== "undefined" && fecha.trim() !== "") ? fecha : null;
      const finalBajad = (bajad === "undefined") ? null : bajad;
      const finalContenido = (contenido === "undefined") ? null : contenido;

      const updatedNews = await pool.query(
        "UPDATE noticias SET titulo = $1, bajad = $2, contenido = $3, imagen_url = $4, fecha = COALESCE($6, fecha) WHERE id = $5 RETURNING *",
        [titulo, finalBajad || null, finalContenido || null, main_image_url, id, finalFecha]
      );

      res.json(updatedNews.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar noticia" });
    }
  }
);

/* GALERÍA / EVENTOS */

app.get("/api/galeria", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM galeria_eventos ORDER BY fecha DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener galería" });
  }
});

app.get("/api/galeria/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await pool.query(
      "SELECT * FROM galeria_eventos WHERE id = $1",
      [id]
    );
    if (event.rows.length === 0)
      return res.status(404).json({ error: "Evento no encontrado" });

    const photos = await pool.query(
      "SELECT imagen_url FROM galeria_fotos WHERE evento_id = $1",
      [id]
    );

    const data = event.rows[0];
    data.fotos = photos.rows.map((p) => p.imagen_url);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener evento" });
  }
});

app.post(
  "/api/galeria",
  authenticateToken,
  upload.array("fotos", 50),
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (
        userResult.rows.length === 0 ||
        (userResult.rows[0].rol !== "admin" && userResult.rows[0].rol !== "representante")
      )
        return res.status(403).json({ error: "Acceso denegado." });

      const { titulo, fecha } = req.body;

      let portada_url = null;
      let fotos_urls = [];

      if (req.files && req.files.length > 0) {
        const processedImages = await Promise.all(req.files.map(async (file) => {
          try {
            const buffer = await optimizeImage(file.path, 'gallery');
            return await saveOptimizedImage(buffer, file.path);
          } catch (error) {
            console.error(`Error optimizando imagen ${file.originalname}:`, error);
            return `/uploads/${file.filename}`;
          }
        }));
        
        portada_url = processedImages[0]; // First one is cover
        fotos_urls = processedImages;
      }

      const newEvent = await pool.query(
        "INSERT INTO galeria_eventos (titulo, fecha, portada_url) VALUES ($1, $2, $3) RETURNING *",
        [titulo, fecha || new Date(), portada_url]
      );

      const eventId = newEvent.rows[0].id;

      for (const url of fotos_urls) {
        await pool.query(
          "INSERT INTO galeria_fotos (evento_id, imagen_url) VALUES ($1, $2)",
          [eventId, url]
        );
      }

      res.json(newEvent.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear evento" });
    }
  }
);

app.delete("/api/galeria/:id", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (
      userResult.rows.length === 0 ||
      (userResult.rows[0].rol !== "admin" && userResult.rows[0].rol !== "representante")
    )
      return res.status(403).json({ error: "Acceso denegado." });

    const { id } = req.params;
    // Postgres CASCADE deletes photos automatically
    await pool.query("DELETE FROM galeria_eventos WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar evento" });
  }
});

app.get("/api/deportes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM deportes ORDER BY nombre ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener deportes" });
  }
});

app.post(
  "/api/deportes",
  authenticateToken,
  upload.single("imagen"),
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (
        userResult.rows.length === 0 ||
        (userResult.rows[0].rol !== "admin" && userResult.rows[0].rol !== "representante")
      )
        return res.status(403).json({ error: "Acceso denegado." });
      const { nombre, dia_horario, profesor, descripcion } = req.body;
      let imagen_url = req.body.imagen_url;
      if (req.file) {
        try {
          const buffer = await optimizeImage(req.file.path, 'gallery');
          imagen_url = await saveOptimizedImage(buffer, req.file.path);
        } catch (error) {
          console.error("Error optimizando imagen deporte:", error);
          imagen_url = `/uploads/${req.file.filename}`;
        }
      }
      const finalDia = (dia_horario && dia_horario !== "undefined" && dia_horario.trim() !== "") ? dia_horario : null;
      const finalProfesor = (profesor === "undefined") ? null : profesor;
      const finalDescripcion = (descripcion === "undefined") ? null : descripcion;

      const newSport = await pool.query(
        "INSERT INTO deportes (nombre, dia_horario, profesor, descripcion, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [nombre, finalDia, finalProfesor || null, finalDescripcion || null, imagen_url]
      );
      res.json(newSport.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear deporte" });
    }
  }
);

app.delete("/api/deportes/:id", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (
      userResult.rows.length === 0 ||
      (userResult.rows[0].rol !== "admin" && userResult.rows[0].rol !== "representante")
    )
      return res.status(403).json({ error: "Acceso denegado." });
    const { id } = req.params;
    await pool.query("DELETE FROM deportes WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar deporte" });
  }
});

app.put(
  "/api/deportes/:id",
  authenticateToken,
  upload.single("imagen"),
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (
        userResult.rows.length === 0 ||
        (userResult.rows[0].rol !== "admin" && userResult.rows[0].rol !== "representante")
      )
        return res.status(403).json({ error: "Acceso denegado." });

      const { id } = req.params;
      const { nombre, dia_horario, profesor, descripcion } = req.body;

      const currentSport = await pool.query(
        "SELECT imagen_url FROM deportes WHERE id = $1",
        [id]
      );
      if (currentSport.rows.length === 0)
        return res.status(404).json({ error: "Deporte no encontrado" });

      let imagen_url = req.body.imagen_url || currentSport.rows[0].imagen_url;
      if (req.file) {
        try {
          const buffer = await optimizeImage(req.file.path, 'gallery');
          imagen_url = await saveOptimizedImage(buffer, req.file.path);
        } catch (error) {
          console.error("Error optimizando imagen deporte:", error);
          imagen_url = `/uploads/${req.file.filename}`;
        }
      }

      const finalDia = (dia_horario && dia_horario !== "undefined" && dia_horario.trim() !== "") ? dia_horario : null;
      const finalProfesor = (profesor === "undefined") ? null : profesor;
      const finalDescripcion = (descripcion === "undefined") ? null : descripcion;

      const updatedSport = await pool.query(
        "UPDATE deportes SET nombre = $1, dia_horario = $2, profesor = $3, descripcion = $4, imagen_url = $5 WHERE id = $6 RETURNING *",
        [nombre, finalDia, finalProfesor || null, finalDescripcion || null, imagen_url, id]
      );

      res.json(updatedSport.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar deporte" });
    }
  }
);

app.put(
  "/api/me/update",
  authenticateToken,
  upload.single("foto_perfil"),
  async (req, res) => {
    try {
      const { telefono, email, fecha_nacimiento, nro_socio } = req.body;
      const userId = req.user.id;

      // Unificar validación de nro_socio si se envía
      const finalNroSocio = nro_socio && nro_socio.trim() !== "" ? nro_socio.trim() : null;
      if (finalNroSocio) {
        const socioCheck = await pool.query(
          "SELECT * FROM socios WHERE nro_socio = $1 AND id != $2",
          [finalNroSocio, userId]
        );
        if (socioCheck.rows.length > 0) {
          return res.status(409).json({ error: "El Número de Socio ya está registrado por otro miembro." });
        }
      }

      const currentUserRes = await pool.query(
        "SELECT foto_perfil FROM socios WHERE id = $1",
        [userId]
      );
      const currentPhoto = currentUserRes.rows[0].foto_perfil;
      let foto_perfil = req.body.foto_perfil || currentPhoto;
      if (req.file) {
        try {
          const buffer = await optimizeImage(req.file.path, 'profile');
          foto_perfil = await saveOptimizedImage(buffer, req.file.path);
        } catch (error) {
           console.error("Error optimizando imagen de perfil:", error);
           foto_perfil = `/uploads/${req.file.filename}`;
        }
      }
      const result = await pool.query(
        "UPDATE socios SET telefono = $1, email = $2, foto_perfil = $3, fecha_nacimiento = COALESCE($5, fecha_nacimiento), nro_socio = $6 WHERE id = $4 RETURNING *",
        [telefono, email, foto_perfil, userId, fecha_nacimiento, finalNroSocio]
      );
      if (result.rows.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });
      const updatedUser = result.rows[0];
      delete updatedUser.password;
      res.json({ success: true, user: updatedUser });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error al actualizar datos" });
    }
  }
);

app.put("/api/me/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Obtener usuario actual
    const userRes = await pool.query(
      "SELECT password FROM socios WHERE id = $1",
      [userId]
    );
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = userRes.rows[0];

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "La contraseña actual es incorrecta" });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    const result = await pool.query(
      "UPDATE socios SET password = $1 WHERE id = $2 RETURNING *",
      [hashedPassword, userId]
    );
    const updatedUser = result.rows[0];
    delete updatedUser.password;

    res.json({
      success: true,
      message: "Contraseña cambiada exitosamente",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
});

app.get("/api/admin/users", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });
    const result = await pool.query(
      "SELECT id, nombre, apellido, dni, nro_socio, account_status, email, telefono, foto_perfil, rol, fecha_nacimiento FROM socios ORDER BY account_status DESC, fecha_alta DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.put(
  "/api/admin/users/:id/nro_socio",
  authenticateToken,
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
        return res.status(403).json({ error: "Acceso denegado." });
      const { id } = req.params;
      const { nro_socio } = req.body;
      const finalNroSocio =
        nro_socio && nro_socio.trim() !== "" ? nro_socio : null;
      if (finalNroSocio) {
        const socioCheck = await pool.query(
          "SELECT * FROM socios WHERE nro_socio = $1 AND id != $2",
          [finalNroSocio, id]
        );
        if (socioCheck.rows.length > 0)
          return res
            .status(409)
            .json({
              error: "El Número de Socio ya está asignado a otro usuario.",
            });
      }
      const result = await pool.query(
        "UPDATE socios SET nro_socio = $1 WHERE id = $2 RETURNING *",
        [finalNroSocio, id]
      );
      res.json({ success: true, user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error actualizando número de socio" });
    }
  }
);

app.put("/api/admin/users/:id/status", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      "UPDATE socios SET account_status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user status" });
  }
});

app.delete("/api/admin/users/:id", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });
    const { id } = req.params;
    if (parseInt(id) === req.user.id)
      return res
        .status(400)
        .json({ error: "No puedes eliminarte a ti mismo." });
    await pool.query("DELETE FROM socios WHERE id = $1", [id]);
    res.json({ success: true, message: "Usuario eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting user" });
  }
});

app.put(
  "/api/admin/users/:id/password",
  authenticateToken,
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
        return res.status(403).json({ error: "Acceso denegado." });

      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "La contraseña debe tener al menos 6 caracteres" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query("UPDATE socios SET password = $1 WHERE id = $2", [
        hashedPassword,
        id,
      ]);

      res.json({ success: true, message: "Contraseña actualizada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating password" });
    }
  }
);

app.put(
  "/api/admin/users/:id/role",
  authenticateToken,
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
        return res.status(403).json({ error: "Acceso denegado." });

      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      if (!['user', 'admin', 'representante'].includes(role)) {
        return res.status(400).json({ error: "Rol inválido" });
      }

      const result = await pool.query(
        "UPDATE socios SET rol = $1 WHERE id = $2 RETURNING *",
        [role, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const updatedUser = result.rows[0];
      delete updatedUser.password;

      res.json({ success: true, user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating role" });
    }
  }
);

app.get("/api/socios/:id?", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id || req.user.id;
    const result = await pool.query(
      "SELECT id, dni, nombre, apellido, nro_socio, tipo_socio, email, telefono, foto_perfil, rol, account_status, fecha_alta, estado_cuota, vencimiento_cuota, fecha_nacimiento FROM socios WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Socio no encontrado" });
    if (id !== req.user.id) {
      const userRes = await pool.query("SELECT rol FROM socios WHERE id = $1", [
        req.user.id,
      ]);
      if (userRes.rows[0].rol !== "admin")
        return res.status(403).json({ error: "Acceso denegado." });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Prode
app.get("/api/matches", authenticateToken, async (req, res) => {
  try {
    const { season, admin } = req.query;
    let query = "SELECT * FROM matches";
    const params = [];
    const whereFlags = [];

    if (season) {
      whereFlags.push(`season = $${params.length + 1}`);
      params.push(season);
    }

    // Default: only show visible matches unless explicitly asking for admin view (and being admin)
    if (admin === 'true') {
      const userResult = await pool.query("SELECT rol FROM socios WHERE id = $1", [req.user.id]);
      if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin") {
        whereFlags.push("visible = TRUE");
      }
      // If admin, don't filter by visible
    } else {
      whereFlags.push("visible = TRUE");
    }

    if (whereFlags.length > 0) {
      query += " WHERE " + whereFlags.join(" AND ");
    }

    query += " ORDER BY start_time ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching matches" });
  }
});

app.get("/api/birthdays", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT nombre, apellido, foto_perfil FROM socios WHERE EXTRACT(MONTH FROM fecha_nacimiento) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(DAY FROM fecha_nacimiento) = EXTRACT(DAY FROM CURRENT_DATE)"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching birthdays" });
  }
});

app.post("/api/matches", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });
    const { home_team, away_team, start_time, matchday, season, visible } = req.body;
    const newMatch = await pool.query(
      "INSERT INTO matches (home_team, away_team, start_time, matchday, season, visible) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        home_team,
        away_team,
        start_time,
        matchday,
        season || new Date().getFullYear().toString(),
        visible !== undefined ? visible : true
      ]
    );
    res.json(newMatch.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating match" });
  }
});

app.delete("/api/matches/:id", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });

    const { id } = req.params;

    // Primero eliminamos las predicciones asociadas (aunque se podría usar CASCADE en la DB, lo hacemos explícito para seguridad)
    await pool.query("DELETE FROM predictions WHERE match_id = $1", [id]);

    // Luego eliminamos el partido
    const result = await pool.query(
      "DELETE FROM matches WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Partido no encontrado" });

    res.json({
      success: true,
      message: "Partido y predicciones eliminados correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el partido" });
  }
});

app.put("/api/matches/:id", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });

    const { id } = req.params;
    const { home_team, away_team, start_time, matchday, season, visible } = req.body;

    // Validaciones básicas
    if (!home_team || !away_team || !start_time || !matchday) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const result = await pool.query(
      "UPDATE matches SET home_team = $1, away_team = $2, start_time = $3, matchday = $4, season = $5, visible = $6 WHERE id = $7 RETURNING *",
      [
        home_team,
        away_team,
        start_time,
        matchday,
        season || new Date().getFullYear().toString(),
        visible !== undefined ? visible : true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partido no encontrado" });
    }

    res.json({ success: true, match: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar el partido" });
  }
});

app.put("/api/matches/:id/visibility", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });

    const { id } = req.params;
    const { visible } = req.body;

    const result = await pool.query(
      "UPDATE matches SET visible = $1 WHERE id = $2 RETURNING *",
      [visible, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partido no encontrado" });
    }

    res.json({ success: true, match: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cambiar visibilidad" });
  }
});

app.put("/api/matches/:id/result", authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const userResult = await client.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });
    const { id } = req.params;
    const { home_score, away_score } = req.body;
    await client.query("BEGIN");
    const matchRes = await client.query(
      "UPDATE matches SET home_score = $1, away_score = $2, status = 'finished' WHERE id = $3 RETURNING *",
      [home_score, away_score, id]
    );
    if (matchRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Partido no encontrado" });
    }
    const predsRes = await client.query(
      "SELECT * FROM predictions WHERE match_id = $1",
      [id]
    );
    const predictions = predsRes.rows;
    for (const pred of predictions) {
      let points = 0;
      if (pred.home_score === home_score && pred.away_score === away_score)
        points = 3;
      else if (
        Math.sign(pred.home_score - pred.away_score) ===
        Math.sign(home_score - away_score)
      )
        points = 1;
      await client.query("UPDATE predictions SET points = $1 WHERE id = $2", [
        points,
        pred.id,
      ]);
    }
    await client.query("COMMIT");
    res.json({
      success: true,
      match: matchRes.rows[0],
      processed_predictions: predictions.length,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Error updating result" });
  } finally {
    client.release();
  }
});

app.get("/api/predictions/my", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT p.*, m.season, m.matchday FROM predictions p JOIN matches m ON p.match_id = m.id WHERE p.user_id = $1",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching predictions" });
  }
});

app.post("/api/predictions", authenticateToken, async (req, res) => {
  try {
    const { match_id, home_score, away_score } = req.body;
    const user_id = req.user.id;

    // Check account status and quota
    const userStatus = await pool.query(
      "SELECT account_status, estado_cuota FROM socios WHERE id = $1",
      [user_id]
    );

    if (userStatus.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { account_status, estado_cuota } = userStatus.rows[0];

    if (account_status !== "approved") {
      return res
        .status(403)
        .json({ error: "Tu cuenta está pendiente de aprobación." });
    }

    if (estado_cuota !== "Al Día") {
      return res
        .status(403)
        .json({ error: "Debes tener la cuota al día para participar." });
    }

    // Check match time
    const matchRes = await pool.query(
      "SELECT start_time FROM matches WHERE id = $1",
      [match_id]
    );
    if (matchRes.rows.length === 0)
      return res.status(404).json({ error: "Partido no encontrado" });
    if (
      new Date() >=
      new Date(
        new Date(matchRes.rows[0].start_time).getTime() - 2 * 60 * 60 * 1000
      )
    )
      return res.status(400).json({ error: "El tiempo límite ha pasado." });

    // Check existing prediction limit
    const existingPred = await pool.query(
      "SELECT * FROM predictions WHERE user_id = $1 AND match_id = $2",
      [user_id, match_id]
    );

    let result;
    if (existingPred.rows.length > 0) {
      const currentCount = existingPred.rows[0].update_count || 0;
      // Existing prediction: Check limit
      // Initial save counts as update_count=0 or 1?
      // Let's say:
      // 1. First save: INSERT -> update_count = 0
      // 2. First edit: UPDATE -> update_count = 1
      // 3. Second edit: UPDATE -> update_count = 2 (LAST CHANCE used)
      // 4. Third edit: Blocked (count is 2)

      // Adjust logic based on user request "unicamente me deberia dejar poder hacer dos veces la prediccion"
      // If they mean "enter, then change, then change", that's 2 changes.
      // If existing count is >= 2, block.

      if (currentCount >= 2) {
        return res
          .status(403)
          .json({
            error: "Has alcanzado el límite de cambios para este partido.",
          });
      }

      result = await pool.query(
        "UPDATE predictions SET home_score = $1, away_score = $2, update_count = update_count + 1 WHERE user_id = $3 AND match_id = $4 RETURNING *",
        [home_score, away_score, user_id, match_id]
      );
    } else {
      // New prediction
      result = await pool.query(
        "INSERT INTO predictions (user_id, match_id, home_score, away_score, update_count) VALUES ($1, $2, $3, $4, 0) RETURNING *",
        [user_id, match_id, home_score, away_score]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error submitting prediction" });
  }
});

app.get("/api/ranking", async (req, res) => {
  try {
    const { season } = req.query;
    let seasonFilter = season ? "AND m.season = $1" : "";
    const params = season ? [season] : [];
    const query = `
            SELECT s.nombre, s.apellido, s.foto_perfil, SUM(p.points) as total_points, COUNT(CASE WHEN p.points = 3 THEN 1 END) as plenos
            FROM predictions p JOIN socios s ON p.user_id = s.id JOIN matches m ON p.match_id = m.id
            WHERE m.status = 'finished' ${seasonFilter}
            GROUP BY s.id, s.nombre, s.apellido, s.foto_perfil ORDER BY total_points DESC, plenos DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching ranking" });
  }
});

app.get("/api/seasons", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT season FROM matches ORDER BY season DESC"
    );
    res.json(result.rows.map((r) => r.season));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching seasons" });
  }
});

// Top players by most recent matchday
app.get("/api/top-players-by-matchday", async (req, res) => {
  try {
    const { season } = req.query;
    
    // Get the most recent matchday with finished matches
    let matchdayQuery = `
      SELECT DISTINCT matchday 
      FROM matches 
      WHERE status = 'finished'
    `;
    let matchdayParams = [];
    
    if (season) {
      matchdayQuery += " AND season = $1";
      matchdayParams.push(season);
    }
    
    matchdayQuery += " ORDER BY matchday DESC LIMIT 1";
    
    const matchdayResult = await pool.query(matchdayQuery, matchdayParams);
    
    if (matchdayResult.rows.length === 0) {
      return res.json({ matchday: null, topPlayers: [] });
    }

    const latestMatchday = matchdayResult.rows[0].matchday;

    // Get top players for that matchday
    let topPlayersQuery = `
      SELECT 
        s.nombre, 
        s.apellido, 
        s.foto_perfil, 
        SUM(p.points) as matchday_points,
        COUNT(CASE WHEN p.points = 3 THEN 1 END) as plenos,
        COUNT(CASE WHEN p.points = 1 THEN 1 END) as aciertos_parciales
      FROM predictions p 
      JOIN socios s ON p.user_id = s.id 
      JOIN matches m ON p.match_id = m.id
      WHERE m.status = 'finished' 
        AND m.matchday = $1
    `;
    
    let topPlayersParams = [latestMatchday];
    
    if (season) {
      topPlayersQuery += " AND m.season = $2";
      topPlayersParams.push(season);
    }
    
    topPlayersQuery += `
      GROUP BY s.id, s.nombre, s.apellido, s.foto_perfil 
      HAVING SUM(p.points) > 0
      ORDER BY matchday_points DESC, plenos DESC
      LIMIT 5
    `;
    
    const topPlayersResult = await pool.query(topPlayersQuery, topPlayersParams);

    res.json({
      matchday: latestMatchday,
      topPlayers: topPlayersResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching top players by matchday" });
  }
});

// Team standings (league table)
app.get("/api/team-standings", async (req, res) => {
  try {
    const { season } = req.query;
    
    let matchesQuery = `
      SELECT home_team, away_team, home_score, away_score
      FROM matches
      WHERE status = 'finished' AND matchday NOT IN ('Amistoso', 'Torneo de Verano')
    `;
    let params = [];
    
    if (season) {
      matchesQuery += " AND season = $1";
      params.push(season);
    }
    
    const matchesResult = await pool.query(matchesQuery, params);
    const matches = matchesResult.rows;
    
    // Calculate standings
    const standings = {};

    // Initialize ALL teams with 0 stats
    // Initialize ALL teams with 0 stats
    const OFFICIAL_TEAMS = [
      '9 de julio',
      'Alianza',
      'Arteaga',
      'Belgrano',
      'Cafferata',
      'Centenario',
      'Chañarense',
      'Deportivo',
      'Federacion',
      'Godeken',
      'Huracan',
      'Independiente'
    ];

    OFFICIAL_TEAMS.forEach(team => {
      standings[team] = {
        team: team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
        points: 0
      };
    });
    
    matches.forEach(match => {
      const { home_team, away_team, home_score, away_score } = match;
      
      // Update stats ONLY if teams are official
      // If a team is not in OFFICIAL_TEAMS, we skip calculating points for them in the main standings table if desired by user.
      // But user request implies only those teams should be in the table. So we check if they exist in standings.
      
      if (!standings[home_team]) return; // Skip if home team is unofficial (e.g. friendly vs external)
      if (!standings[away_team]) return; // Skip if away team is unofficial


      // Update stats
      standings[home_team].played++;
      standings[away_team].played++;
      
      standings[home_team].goals_for += home_score;
      standings[home_team].goals_against += away_score;
      
      standings[away_team].goals_for += away_score;
      standings[away_team].goals_against += home_score;
      
      // Determine result
      if (home_score > away_score) {
        // Home win
        standings[home_team].won++;
        standings[home_team].points += 3;
        standings[away_team].lost++;
      } else if (home_score < away_score) {
        // Away win
        standings[away_team].won++;
        standings[away_team].points += 3;
        standings[home_team].lost++;
      } else {
        // Draw
        standings[home_team].drawn++;
        standings[away_team].drawn++;
        standings[home_team].points += 1;
        standings[away_team].points += 1;
      }
      
      // Update goal difference
      standings[home_team].goal_difference = standings[home_team].goals_for - standings[home_team].goals_against;
      standings[away_team].goal_difference = standings[away_team].goals_for - standings[away_team].goals_against;
    });
    
    // Convert to array and sort
    const standingsArray = Object.values(standings).sort((a, b) => {
      // Sort by points, then goal difference, then goals for
      if (b.points !== a.points) return b.points - a.points;
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
      return b.goals_for - a.goals_for;
    });
    
    res.json(standingsArray);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching team standings" });
  }
});

// Sponsors
app.get("/api/sponsors", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sponsors WHERE activo = TRUE ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener sponsors" });
  }
});

app.get("/api/admin/sponsors", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });
    const result = await pool.query("SELECT * FROM sponsors ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener sponsors (admin)" });
  }
});

app.post(
  "/api/sponsors",
  authenticateToken,
  upload.single("imagen"),
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
        return res.status(403).json({ error: "Acceso denegado." });
      const { nombre, link, ubicacion } = req.body;
      const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;
      if (!nombre || !imagen_url)
        return res.status(400).json({ error: "Faltan datos" });
      const newSponsor = await pool.query(
        "INSERT INTO sponsors (nombre, imagen_url, link, ubicacion) VALUES ($1, $2, $3, $4) RETURNING *",
        [nombre, imagen_url, link, ubicacion || "footer"]
      );
      res.json(newSponsor.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear sponsor" });
    }
  }
);

app.put(
  "/api/sponsors/:id",
  authenticateToken,
  upload.single("imagen"),
  async (req, res) => {
    try {
      const userResult = await pool.query(
        "SELECT rol FROM socios WHERE id = $1",
        [req.user.id]
      );
      if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
        return res.status(403).json({ error: "Acceso denegado." });
      const { id } = req.params;
      const { nombre, link, ubicacion, activo } = req.body;
      const currentRes = await pool.query(
        "SELECT * FROM sponsors WHERE id = $1",
        [id]
      );
      if (currentRes.rows.length === 0)
        return res.status(404).json({ error: "Sponsor no encontrado" });
      const current = currentRes.rows[0];
      const finalImagen = req.file
        ? `/uploads/${req.file.filename}`
        : current.imagen_url;
      const updated = await pool.query(
        "UPDATE sponsors SET nombre = $1, imagen_url = $2, link = $3, ubicacion = $4, activo = $5 WHERE id = $6 RETURNING *",
        [
          nombre || current.nombre,
          finalImagen,
          link || current.link,
          ubicacion || current.ubicacion,
          activo !== undefined ? activo : current.activo,
          id,
        ]
      );
      res.json(updated.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar" });
    }
  }
);

app.delete("/api/sponsors/:id", authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT rol FROM socios WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].rol !== "admin")
      return res.status(403).json({ error: "Acceso denegado." });
    const { id } = req.params;
    await pool.query("DELETE FROM sponsors WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar" });
  }
});

app.post("/api/sponsors/:id/click", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE sponsors SET clics = clics + 1 WHERE id = $1", [
      id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});

// --- INTEGRACIÓN FRONTEND ---
// (Estáticos de uploads ya configurados arriba)

const distPath = path.join(__dirname, "../dist");
const indexPath = path.join(distPath, "index.html");

if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
  console.log('Modo ProducciÃ³n: Sirviendo frontend desde la carpeta "dist".');
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  console.log(
    'Modo Desarrollo: No se encontrÃ³ la carpeta "dist". El servidor solo responderÃ¡ a la API.'
  );
}

const initDb = async () => {
  console.log("Iniciando verificación de base de datos...");
  try {
    // 1. Socios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS socios (
        id SERIAL PRIMARY KEY,
        dni VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        nro_socio VARCHAR(50),
        tipo_socio VARCHAR(50),
        email VARCHAR(100),
        telefono VARCHAR(50),
        foto_perfil TEXT,
        rol VARCHAR(20) DEFAULT 'user',
        fecha_alta DATE DEFAULT CURRENT_DATE,
        estado_cuota VARCHAR(20) DEFAULT 'Al Día',
        vencimiento_cuota DATE,
        account_status VARCHAR(20) DEFAULT 'pending',
        fecha_nacimiento DATE
      );
    `);

    // 2. Noticias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS noticias (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        bajad TEXT,
        contenido TEXT,
        imagen_url TEXT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Noticias Imagenes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS noticias_imagenes (
        id SERIAL PRIMARY KEY,
        noticia_id INTEGER REFERENCES noticias(id) ON DELETE CASCADE,
        imagen_url TEXT NOT NULL
      );
    `);

    // 4. Galeria Eventos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS galeria_eventos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        fecha DATE DEFAULT CURRENT_DATE,
        portada_url TEXT
      );
    `);

    // 5. Galeria Fotos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS galeria_fotos (
        id SERIAL PRIMARY KEY,
        evento_id INTEGER REFERENCES galeria_eventos(id) ON DELETE CASCADE,
        imagen_url TEXT NOT NULL
      );
    `);

    // 6. Deportes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deportes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        dia_horario VARCHAR(255),
        profesor VARCHAR(100),
        descripcion TEXT,
        imagen_url TEXT
      );
    `);

    // 7. Matches (Prode)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        home_team VARCHAR(100) NOT NULL,
        away_team VARCHAR(100) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        matchday INTEGER,
        season VARCHAR(20),
        home_score INTEGER,
        away_score INTEGER,
        visible BOOLEAN DEFAULT TRUE
      );
    `);

    // Add column if it doesn't exist (for existing tables)
    await pool.query(`
      ALTER TABLE matches ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT TRUE;
    `);

    // 8. Predictions (Prode)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES socios(id) ON DELETE CASCADE,
        match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
        home_score INTEGER NOT NULL,
        away_score INTEGER NOT NULL,
        points INTEGER DEFAULT 0,
        UNIQUE(user_id, match_id)
      );
    `);

    // 9. Sponsors
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        imagen_url TEXT NOT NULL,
        link TEXT,
        ubicacion VARCHAR(20) DEFAULT 'footer',
        activo BOOLEAN DEFAULT TRUE,
        clics INTEGER DEFAULT 0,
        fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tablas de base de datos verificadas/creadas correctamente.");
  } catch (err) {
    console.error("ERROR CRÍTICO en initDb:", err.message);
    throw err;
  }
};

const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error fatal al iniciar el servidor:", err);
    process.exit(1);
  }
};

startServer();
