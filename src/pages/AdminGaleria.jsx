import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Image as ImageIcon, Save } from 'lucide-react';
import { API_URL } from '../config';

const AdminGaleria = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEvent, setNewEvent] = useState({ titulo: '', fecha: '', fotos: [] });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_URL}/galeria`);
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('titulo', newEvent.titulo);
        formData.append('fecha', newEvent.fecha);
        
        if (newEvent.fotos && newEvent.fotos.length > 0) {
            newEvent.fotos.forEach(file => {
                formData.append('fotos', file);
            });
        } else {
             setMessage({ text: 'Debes subir al menos una foto', type: 'error' });
             return;
        }

        try {
            const res = await fetch(`${API_URL}/galeria`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                setMessage({ text: 'Evento creado correctamente', type: 'success' });
                setNewEvent({ titulo: '', fecha: '', fotos: [] });
                fetchEvents();
                // Clear file input manually if needed, or rely on state reset
                document.getElementById('fileInput').value = '';
            } else {
                setMessage({ text: 'Error al crear evento', type: 'error' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Error de conexión', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Seguro que querés borrar este evento y todas sus fotos?')) return;
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`${API_URL}/galeria/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) fetchEvents();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black uppercase">Administrar Galería</h1>
                <button onClick={() => window.location.href='/socios'} className="bg-gray-200 px-4 py-2 rounded font-bold hover:bg-gray-300 uppercase text-sm">Volver</button>
            </div>

            {message.text && (
                <div className={`p-4 rounded mb-8 font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {/* CREATE FORM */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-12">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Plus size={24} /> Nuevo Evento / Álbum
                </h2>
                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Título del Evento</label>
                            <input 
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-black outline-none font-bold" 
                                placeholder="Ej: Cena Fin de Año 2024" 
                                value={newEvent.titulo} 
                                onChange={e => setNewEvent({...newEvent, titulo: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Fecha</label>
                            <input 
                                type="date"
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-black outline-none font-bold" 
                                value={newEvent.fecha} 
                                onChange={e => setNewEvent({...newEvent, fecha: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 mb-1">Fotos (La primera será la portada)</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-black transition-colors bg-gray-50 cursor-pointer relative">
                            <input 
                                id="fileInput"
                                type="file" 
                                multiple 
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={e => setNewEvent({...newEvent, fotos: Array.from(e.target.files)})} 
                            />
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                            <p className="font-bold text-gray-600">Click para seleccionar fotos</p>
                            <p className="text-xs text-gray-400">Podés subir múltiples archivos a la vez</p>
                        </div>
                        
                        {newEvent.fotos.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {newEvent.fotos.map((f, i) => (
                                    <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                        {f.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        <Save size={20} /> Crear Álbum
                    </button>
                </form>
            </div>

            {/* LIST */}
            <h2 className="text-2xl font-black uppercase mb-6">Eventos Publicados</h2>
            {loading ? <p>Cargando...</p> : !Array.isArray(events) || events.length === 0 ? (
                <p className="text-gray-500">No hay eventos todavía.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div key={event.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                                <img 
                                    src={`${API_URL}${event.portada_url}`} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    alt={event.titulo}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg leading-tight mb-2">{event.titulo}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} /> {new Date(event.fecha).toLocaleDateString()}
                                    </span>
                                    <button 
                                        onClick={() => handleDelete(event.id)} 
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Eliminar Evento"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminGaleria;
