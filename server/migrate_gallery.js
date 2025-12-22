const pool = require('./db');
const fs = require('fs');
const path = require('path');

const migrate = async () => {
    try {
        console.log('Iniciando migración de Galería...');

        // Create Tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS noticias_imagenes (
                id SERIAL PRIMARY KEY,
                noticia_id INTEGER REFERENCES noticias(id) ON DELETE CASCADE,
                imagen_url TEXT NOT NULL
            );
        `);
        console.log('Tabla noticias_imagenes verificada.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS galeria_eventos (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                fecha DATE DEFAULT CURRENT_DATE,
                portada_url TEXT
            );
        `);
        console.log('Tabla galeria_eventos verificada.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS galeria_fotos (
                id SERIAL PRIMARY KEY,
                evento_id INTEGER REFERENCES galeria_eventos(id) ON DELETE CASCADE,
                imagen_url TEXT NOT NULL
            );
        `);
        console.log('Tabla galeria_fotos verificada.');

        console.log('Migración completada con éxito.');
        process.exit(0);

    } catch (err) {
        console.error('Error durante la migración:', err);
        process.exit(1);
    }
};

migrate();
