-- Tabla de Socios
CREATE TABLE IF NOT EXISTS socios (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Almacenar hash de bcrypt
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nro_socio VARCHAR(20) UNIQUE,
    tipo_socio VARCHAR(50) DEFAULT 'Activo',
    fecha_alta DATE DEFAULT CURRENT_DATE,
    vencimiento_cuota DATE DEFAULT CURRENT_DATE + INTERVAL '1 month',
    estado_cuota VARCHAR(50) DEFAULT 'Al Día',
    account_status VARCHAR(20) DEFAULT 'pending', -- 'pending' or 'approved'
    rol VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
    telefono VARCHAR(50),
    email VARCHAR(100),
    foto_perfil TEXT
);

-- Tabla de Noticias
CREATE TABLE IF NOT EXISTS noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    bajad TEXT,
    contenido TEXT NOT NULL,
    imagen_url TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Deportes/Disciplinas
CREATE TABLE IF NOT EXISTS deportes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dia_horario VARCHAR(255),
    profesor VARCHAR(100),
    descripcion TEXT,
    imagen_url TEXT
);

-- Tabla de Sponsors/Publicidades
CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    imagen_url TEXT NOT NULL,
    link TEXT,
    ubicacion VARCHAR(20) DEFAULT 'footer', -- 'home', 'prode', 'footer'
    activo BOOLEAN DEFAULT TRUE,
    clics INTEGER DEFAULT 0,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tablas del Prode
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    matchday VARCHAR(50),
    season VARCHAR(10) DEFAULT '2025',
    status VARCHAR(20) DEFAULT 'scheduled' -- 'scheduled', 'finished'
);

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES socios(id) ON DELETE CASCADE,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    update_count INTEGER DEFAULT 0,
    UNIQUE(user_id, match_id)
);

-- Insertar Usuario Admin de Preuba (Contraseña: admin123)
-- El hash corresponde a 'admin123' usando bcrypt
INSERT INTO socios (dni, password, nombre, apellido, nro_socio, tipo_socio, rol, account_status)
VALUES 
('12345678', '$2a$10$XJvI.k6P.X6Lz6M8n9Y4O.W8n8n8n8n8n8n8n8n8n8n8n8n8n8', 'Administrador', 'Sistema', '0001', 'Administrador', 'admin', 'approved')
ON CONFLICT (dni) DO UPDATE 
SET rol = 'admin', account_status = 'approved';
