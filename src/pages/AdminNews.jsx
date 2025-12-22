import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [newPost, setNewPost] = useState({ titulo: '', bajad: '', contenido: '', imagenes: [] });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const res = await fetch(`${API_URL}/noticias`);
        const data = await res.json();
        setNews(data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('titulo', newPost.titulo);
        formData.append('bajad', newPost.bajad);
        formData.append('contenido', newPost.contenido);
        
        if (newPost.imagenes) {
            newPost.imagenes.forEach(file => {
                formData.append('imagenes', file);
            });
        }

        const res = await fetch(`${API_URL}/noticias`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
            body: formData
        });

        if (res.ok) {
            setMessage('Noticia creada correctamente!');
            setNewPost({ titulo: '', bajad: '', contenido: '', imagenes: [] });
            fetchNews();
        } else {
            setMessage('Error al crear noticia (permisos insuficientes?)');
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!confirm('¿Seguro que querés borrar esta noticia?')) return;

        const res = await fetch(`${API_URL}/noticias/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
            fetchNews();
        } else {
            alert('Error al borrar');
        }
    };
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-black uppercase">Administrar Noticias</h2>
                <button onClick={() => window.location.href='/socios'} className="bg-gray-200 px-4 py-2 rounded font-bold hover:bg-gray-300 uppercase text-sm">Volver</button>
            </div>
            
            {message && <div className="bg-green-100 p-4 rounded mb-4 text-green-800 font-bold">{message}</div>}

            <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-lg border mb-12">
                <h3 className="text-xl font-bold mb-4">Nueva Noticia</h3>
                <div className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Título" value={newPost.titulo} onChange={e => setNewPost({...newPost, titulo: e.target.value})} required />
                    <input className="w-full border p-2 rounded" placeholder="Bajada (Resumen)" value={newPost.bajad} onChange={e => setNewPost({...newPost, bajad: e.target.value})} />
                    <textarea className="w-full border p-2 rounded h-32" placeholder="Contenido" value={newPost.contenido} onChange={e => setNewPost({...newPost, contenido: e.target.value})} required />
                    
                    <div>
                        <label className="block text-sm font-bold mb-1">Imágenes (La primera será la portada)</label>
                        <input type="file" multiple className="w-full border p-2 rounded" accept="image/*" onChange={e => setNewPost({...newPost, imagenes: Array.from(e.target.files)})} />
                        {newPost.imagenes && newPost.imagenes.length > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                                {newPost.imagenes.length} archivos seleccionados
                            </div>
                        )}
                    </div>

                    <button type="submit" className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800">PUBLICAR</button>
                </div>
            </form>

            <h3 className="text-xl font-bold mb-4">Noticias Publicadas</h3>
            <div className="space-y-4">
                {news.map(n => (
                    <div key={n.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded shadow border gap-4">
                        <div>
                            <h4 className="font-bold">{n.titulo}</h4>
                            <p className="text-sm text-gray-500">{new Date(n.fecha).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDelete(n.id)} className="text-red-600 font-bold hover:underline self-end md:self-auto">ELIMINAR</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminNews;
