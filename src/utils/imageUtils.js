import { API_URL } from '../config';

export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    
    // Normalizar barras invertidas (Windows) a barras normales (Web/Linux)
    // Esto previene que rutas como "uploads\\imagen.jpg" fallen en producción
    let normalizedPath = path.replace(/\\/g, '/');

    // Asegurar que la ruta empiece con "/" si es relativa
    if (!normalizedPath.startsWith('/') && !normalizedPath.startsWith('http')) {
        normalizedPath = '/' + normalizedPath;
    }

    if (window.location.hostname === 'localhost') {
        const baseUrl = 'http://localhost:3000';
        return `${baseUrl}${normalizedPath}`;
    }
    
    return normalizedPath;
};
