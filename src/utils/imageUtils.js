import { API_URL } from '../config';

export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    
    // Normalizar barras invertidas (Windows) a barras normales (Web/Linux)
    // Esto previene que rutas como "uploads\\imagen.jpg" fallen en producción
    let normalizedPath = path.replace(/\\/g, '/');

    // Obtener la base de la API sin el "/api" final
    const apiBase = API_URL.replace(/\/api$/, '');
    
    // Si ya es una URL completa, devolverla
    if (normalizedPath.startsWith('http')) return normalizedPath;

    // Asegurar que la ruta empiece con "/"
    if (!normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
    }

    // En producción, si la ruta no empieza con /api, se la agregamos para que pase por el proxy/backend
    if (window.location.hostname !== 'localhost' && !normalizedPath.startsWith('/api')) {
        // El servidor sirve las imágenes tanto en /uploads como en /api/uploads
        // Usar /api/uploads es más seguro si el frontend está en el root
        normalizedPath = '/api' + normalizedPath;
    }

    return `${apiBase}${normalizedPath}`;
};
