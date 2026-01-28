import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import ConfirmationModal from '../components/ConfirmationModal';
import { Edit, Trash2, X, Send } from 'lucide-react';

const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [formData, setFormData] = useState({ titulo: '', contenido: '', imagenes: [], fecha: new Date().toISOString().slice(0, 16) });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const res = await fetch(`${API_URL}/noticias`);
        const data = await res.json();
        setNews(data);
    };

    const handleEdit = (noticia) => {
        setIsEditing(true);
        setEditId(noticia.id);
        setFormData({
            titulo: noticia.titulo || '',
            contenido: noticia.contenido || '',
            fecha: noticia.fecha ? new Date(noticia.fecha).toISOString().slice(0, 16) : '',
            imagenes: [] // Reset images as they need to be re-selected if changing
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ titulo: '', contenido: '', imagenes: [], fecha: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const data = new FormData();
        data.append('titulo', formData.titulo);
        data.append('contenido', formData.contenido);
        data.append('fecha', formData.fecha);
        
        if (formData.imagenes) {
            formData.imagenes.forEach(file => {
                data.append('imagenes', file);
            });
        }

        const url = isEditing ? `${API_URL}/noticias/${editId}` : `${API_URL}/noticias`;
        const method = isEditing ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });

        if (res.ok) {
            setMessage(isEditing ? 'Noticia actualizada!' : 'Noticia creada correctamente!');
            cancelEdit();
            fetchNews();
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage('Error al procesar la noticia');
        }
    };

    const confirmDelete = (id) => {
        setConfirmModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        const { id } = confirmModal;
        const token = localStorage.getItem('token');

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
            <ConfirmationModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Eliminar Noticia"
                message="¿Estás seguro de que querés eliminar esta noticia? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                isDestructive={true}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-black uppercase text-club-dark">Administrar Noticias</h2>
                <button onClick={() => window.location.href='/socios'} className="bg-gray-200 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 uppercase text-sm transition-colors">Volver</button>
            </div>
            
            {message && <div className="bg-green-600 p-4 rounded-lg mb-6 text-white font-bold shadow-lg animate-bounce">{message}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 mb-12">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h3 className="text-2xl font-black uppercase text-gray-800">
                        {isEditing ? 'Editar Noticia' : 'Nueva Noticia'}
                    </h3>
                    {isEditing && (
                        <button type="button" onClick={cancelEdit} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold text-sm uppercase">
                            <X size={18} /> Cancelar edición
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">Título</label>
                        <input className="w-full border-2 p-3 rounded-lg focus:border-black outline-none transition-colors" placeholder="Título impactante..." value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">Descripción (Opcional)</label>
                        <textarea className="w-full border-2 p-3 rounded-lg focus:border-black outline-none transition-colors h-48" placeholder="Escribí aquí toda la noticia..." value={formData.contenido} onChange={e => setFormData({...formData, contenido: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase text-club-red">Fecha de Publicación (Opcional - solo para el calendario)</label>
                        <input 
                            type="datetime-local"
                            className="w-full border-2 p-3 rounded-lg focus:border-black outline-none transition-colors"
                            value={formData.fecha} 
                            onChange={e => setFormData({...formData, fecha: e.target.value})} 
                        />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase flex items-center gap-2">
                             Imágenes {isEditing ? '(opcional: subir para reemplazar)' : '(La primera será la portada)'}
                        </label>
                        <input type="file" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-black file:text-white hover:file:bg-gray-800" accept="image/*" onChange={e => setFormData({...formData, imagenes: Array.from(e.target.files)})} />
                        {formData.imagenes.length > 0 && (
                            <div className="text-sm font-bold text-gray-800 mt-2">
                                {formData.imagenes.length} archivos seleccionados
                            </div>
                        )}
                    </div>

                    <button type="submit" className={`w-full flex justify-center items-center gap-2 text-white px-6 py-4 rounded-lg font-black uppercase text-lg shadow-lg transition-all transform hover:scale-[1.02] ${isEditing ? 'bg-gray-800' : 'bg-black hover:bg-gray-800'}`}>
                        {isEditing ? <Edit size={20} /> : <Send size={20} />}
                        {isEditing ? 'Guardar Cambios' : 'Publicar Noticia'}
                    </button>
                </div>
            </form>

            <h3 className="text-2xl font-black uppercase mb-6 text-gray-800 border-l-4 border-black pl-3">Noticias Publicadas</h3>
            <div className="grid gap-4">
                {news.map(n => (
                    <div key={n.id} className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all gap-4">
                        <div className="flex-grow">
                            <h4 className="font-bold text-lg text-gray-800 group-hover:text-black transition-colors uppercase">{n.titulo}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                {n.fecha && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(n.fecha).toLocaleDateString()}</p>}
                                {n.fecha && n.contenido && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                                {n.contenido && <p className="text-xs font-bold text-gray-500 italic truncate max-w-[200px]">{n.contenido}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => handleEdit(n)} 
                                className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-gray-100 text-black px-4 py-2 rounded-lg font-bold hover:bg-black hover:text-white transition-all text-xs uppercase"
                            >
                                <Edit size={14} /> Editar
                            </button>
                            <button 
                                onClick={() => confirmDelete(n.id)} 
                                className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all text-xs uppercase"
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminNews;
