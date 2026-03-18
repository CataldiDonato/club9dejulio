-- TABLA SOCIOS
CREATE TABLE IF NOT EXISTS socios(
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

-- TABLA NOTICIAS
CREATE TABLE IF NOT EXISTS noticias(
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    bajad TEXT,
    contenido TEXT,
    imagen_url TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA NOTICIAS IMAGENES
CREATE TABLE IF NOT EXISTS noticias_imagenes(
    id SERIAL PRIMARY KEY,
    noticia_id INTEGER REFERENCES noticias(id) ON DELETE CASCADE,
    imagen_url TEXT NOT NULL
);

-- TABLA GALERIA EVENTOS
CREATE TABLE IF NOT EXISTS galeria_eventos(
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    portada_url TEXT
);

-- TABLA GALERIA FOTOS
CREATE TABLE IF NOT EXISTS galeria_fotos(
    id SERIAL PRIMARY KEY,
    evento_id INTEGER REFERENCES galeria_eventos(id) ON DELETE CASCADE,
    imagen_url TEXT NOT NULL
);

-- TABLA DEPORTES
CREATE TABLE IF NOT EXISTS deportes(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dia_horario VARCHAR(255),
    profesor VARCHAR(100),
    descripcion TEXT,
    imagen_url TEXT
);

-- TABLA MATCHES (PRODE)
CREATE TABLE IF NOT EXISTS matches(
    id SERIAL PRIMARY KEY,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    matchday INTEGER,
    season VARCHAR(20),
    home_score INTEGER,
    away_score INTEGER,
    visible BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'upcoming',
    home_points_override INTEGER,
    away_points_override INTEGER
);

-- TABLA PREDICTIONS (PRODE)
CREATE TABLE IF NOT EXISTS predictions(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES socios(id) ON DELETE CASCADE,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    update_count INTEGER DEFAULT 0,
    UNIQUE(user_id, match_id)
);

-- TABLA SPONSORS
CREATE TABLE IF NOT EXISTS sponsors(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    imagen_url TEXT NOT NULL,
    link TEXT,
    ubicacion VARCHAR(20) DEFAULT 'footer',
    activo BOOLEAN DEFAULT TRUE,
    clics INTEGER DEFAULT 0,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA JUGADORES
CREATE TABLE IF NOT EXISTS jugadores(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    imagen_url TEXT,
    juega BOOLEAN DEFAULT TRUE
);

-- TABLA VOTACIONES
CREATE TABLE IF NOT EXISTS votaciones(
    id SERIAL PRIMARY KEY,
    jugador_id INTEGER REFERENCES jugadores(id) ON DELETE CASCADE,
    fecha_torneo VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
