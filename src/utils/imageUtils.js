import { API_URL } from '../config';

export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    
    // If running on localhost and path is relative, prepend localhost base URL
    // API_URL in config usually points to /api or localhost:3000/api
    // We assume images are served from root/uploads
    if (window.location.hostname === 'localhost') {
        const baseUrl = 'http://localhost:3000';
        return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
    }
    
    // In production, relative paths are usually fine if served from same origin
    return path;
};
