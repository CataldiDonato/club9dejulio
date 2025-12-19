CREATE TABLE IF NOT EXISTS socios (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL, -- In production, use hashing!
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nro_socio VARCHAR(20) UNIQUE,
    tipo_socio VARCHAR(50) DEFAULT 'Activo',
    fecha_alta DATE DEFAULT CURRENT_DATE,
    vencimiento_cuota DATE,
    rol VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
    telefono VARCHAR(50),
    email VARCHAR(100),
    foto_perfil TEXT
);

-- Ensure rol column exists for existing tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='socios' AND column_name='rol') THEN
        ALTER TABLE socios ADD COLUMN rol VARCHAR(20) DEFAULT 'user';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    bajad TEXT,
    contenido TEXT NOT NULL,
    imagen_url TEXT,
    fecha DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS deportes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dia_horario VARCHAR(255),
    profesor VARCHAR(100),
    descripcion TEXT,
    imagen_url TEXT
);

-- Insert dummy data for testing
INSERT INTO socios (dni, password, nombre, apellido, nro_socio, tipo_socio, rol, vencimiento_cuota)
VALUES 
('87654321', 'admin', 'Maria', 'Gomez', '1002', 'Vitalicio', 'admin', '2024-12-31')
ON CONFLICT (dni) DO UPDATE 
SET rol = 'admin'; -- Ensure we have at least one admin

-- Prode Tables
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

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES socios(id),
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    UNIQUE(user_id, match_id)
);
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
