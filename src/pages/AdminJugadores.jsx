import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Trash2, Plus, Edit2, Check, X, User } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminJugadores = () => {
    const [jugadores, setJugadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ isOpen: false, type: null, jugador: null });
    const [form, setForm] = useState({ nombre: '', juega: true, imagen: null });
    const [isEditing, setIsEditing] = useState(null); // ID del jugador en edicion

    const fetchJugadores = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/jugadores`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/socios';
                return;
            }
            const data = await res.json();
            setJugadores(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJugadores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('juega', form.juega);
        if (form.imagen) {
            formData.append('imagen', form.imagen);
        }

        try {
            const url = isEditing
                ? `${API_URL}/admin/jugadores/${isEditing}`
                : `${API_URL}/admin/jugadores`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                setForm({ nombre: '', juega: true, imagen: null });
                setIsEditing(null);
                fetchJugadores();
            } else {
                alert('Error al guardar jugador');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión');
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/admin/jugadores/${modal.jugador.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchJugadores();
        } catch (err) {
            console.error(err);
        } finally {
            setModal({ isOpen: false, type: null, jugador: null });
        }
    };

    const toggleJuega = async (jugador) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('nombre', jugador.nombre);
        formData.append('juega', !jugador.juega);

        try {
            const res = await fetch(`${API_URL}/admin/jugadores/${jugador.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.ok) fetchJugadores();
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (jugador) => {
        setIsEditing(jugador.id);
        setForm({
            nombre: jugador.nombre,
            juega: jugador.juega,
            imagen: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ isOpen: false, type: null, jugador: null })}
                onConfirm={handleDelete}
                title="Eliminar Jugador"
                message={`¿Estás seguro de eliminar a ${modal.jugador?.nombre}?`}
                isDestructive={true}
            />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black uppercase tracking-tighter italic">Administrar Jugadores</h1>
                <button onClick={() => window.location.href = '/socios'} className="bg-gray-200 px-4 py-2 rounded font-bold uppercase text-xs hover:bg-gray-300">Volver</button>
            </div>

            {/* Formulario */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-10">
                <h2 className="text-xl font-bold mb-4 uppercase">{isEditing ? 'Editar Jugador' : 'Nuevo Jugador'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                                className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-600 outline-none transition-colors"
                                placeholder="Ej: Lionel Messi"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Foto (opcional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setForm({ ...form, imagen: e.target.files[0] })}
                                className="w-full p-2.5 rounded-xl border-2 border-gray-100 focus:border-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={form.juega}
                                onChange={e => setForm({ ...form, juega: e.target.checked })}
                                className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-bold uppercase text-gray-700 select-none">¿Juega este fin de semana?</span>
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Actualizar Jugador' : 'Crear Jugador'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => { setIsEditing(null); setForm({ nombre: '', juega: true, imagen: null }); }}
                                className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-black uppercase"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Cargando jugadores...</div>
                ) : jugadores.length === 0 ? (
                    <div className="col-span-full bg-gray-50 border-2 border-dashed border-gray-200 p-10 rounded-2xl text-center">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold uppercase italic">No hay jugadores registrados.</p>
                    </div>
                ) : jugadores.map(jugador => (
                    <div key={jugador.id} className={`bg-white p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${jugador.juega ? 'border-gray-100' : 'border-red-100 bg-red-50/10'}`}>
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border">
                            {jugador.imagen_url ? (
                                <img src={`${API_URL.replace('/api', '')}${jugador.imagen_url}`} alt={jugador.nombre} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-full h-full p-3 text-gray-300" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate uppercase">{jugador.nombre}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${jugador.juega ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {jugador.juega ? 'JUEGA' : 'NO JUEGA'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => toggleJuega(jugador)}
                                title={jugador.juega ? 'Marcar como No Juega' : 'Marcar como Juega'}
                                className={`p-2 rounded-lg transition-colors ${jugador.juega ? 'text-green-600 hover:bg-green-100' : 'text-red-600 hover:bg-red-100'}`}
                            >
                                {jugador.juega ? <Check size={20} /> : <X size={20} />}
                            </button>
                            <button
                                onClick={() => startEdit(jugador)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={() => setModal({ isOpen: true, type: 'DELETE', jugador })}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminJugadores;
