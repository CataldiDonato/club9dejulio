import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import ConfirmationModal from '../components/ConfirmationModal';
import { Edit, Trash2, X, Plus, Calendar, Clock, User } from 'lucide-react';

const AdminSports = () => {
    const [sports, setSports] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', dia_horario: '', profesor: '', descripcion: '', imagen: null });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        const res = await fetch(`${API_URL}/deportes`);
        const data = await res.json();
        setSports(data);
    };

    const handleEdit = (deporte) => {
        setIsEditing(true);
        setEditId(deporte.id);
        
        // Intentar formatear la fecha para datetime-local si es posible, sino dejar vacío para que elijan una nueva
        let dateVal = '';
        try {
            if (deporte.dia_horario) {
                const date = new Date(deporte.dia_horario);
                if (!isNaN(date.getTime())) {
                    dateVal = date.toISOString().slice(0, 16);
                }
            }
        } catch(e) {}

        setFormData({
            nombre: deporte.nombre || '',
            dia_horario: dateVal,
            profesor: deporte.profesor || '',
            descripcion: deporte.descripcion || '',
            imagen: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ nombre: '', dia_horario: '', profesor: '', descripcion: '', imagen: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('dia_horario', formData.dia_horario);
        data.append('profesor', formData.profesor);
        data.append('descripcion', formData.descripcion);
        if (formData.imagen) {
            data.append('imagen', formData.imagen);
        }

        const url = isEditing ? `${API_URL}/deportes/${editId}` : `${API_URL}/deportes`;
        const method = isEditing ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });

        if (res.ok) {
            setMessage(isEditing ? 'Deporte actualizado!' : 'Deporte agregado correctamente!');
            cancelEdit();
            fetchSports();
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage('Error al procesar el deporte');
        }
    };

    const confirmDelete = (id) => {
        setConfirmModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        const { id } = confirmModal;
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/deportes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
            fetchSports();
        } else {
            alert('Error al borrar');
        }
    };

    const formatDateTime = (str) => {
        if (!str) return 'No definido';
        const d = new Date(str);
        if (isNaN(d.getTime())) return str;
        return d.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <ConfirmationModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Eliminar Deporte"
                message="¿Estás seguro de que querés eliminar este deporte? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                isDestructive={true}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-black uppercase text-club-dark">Administrar Deportes</h2>
                <button onClick={() => window.location.href='/socios'} className="bg-gray-200 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 uppercase text-sm transition-colors">Volver</button>
            </div>
            
            {message && <div className="bg-green-600 p-4 rounded-lg mb-6 text-white font-bold shadow-lg shadow-green-200 animate-in slide-in-from-top duration-300">{message}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 mb-12">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h3 className="text-2xl font-black uppercase text-gray-800">
                        {isEditing ? 'Editar Deporte' : 'Nuevo Deporte'}
                    </h3>
                    {isEditing && (
                        <button type="button" onClick={cancelEdit} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold text-sm uppercase">
                            <X size={18} /> Cancelar edición
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">Nombre del Deporte</label>
                            <input className="w-full border-2 p-3 rounded-lg focus:border-black outline-none transition-colors" placeholder="ej: Fútbol, Padel..." value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">Profesor / Encargado</label>
                            <input className="w-full border-2 p-3 rounded-lg focus:border-black outline-none transition-colors" placeholder="Nombre del Profe..." value={formData.profesor} onChange={e => setFormData({...formData, profesor: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">Fecha y Hora de Práctica</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input 
                                type="datetime-local" 
                                className="w-full border-2 p-3 pl-10 rounded-lg focus:border-black outline-none transition-colors" 
                                value={formData.dia_horario} 
                                onChange={e => setFormData({...formData, dia_horario: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">Descripción</label>
                        <textarea className="w-full border-2 p-3 rounded-lg focus:border-black outline-none transition-colors h-24" placeholder="Breve descripción de la actividad..." value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Imagen {isEditing ? '(opcional: subir para reemplazar)' : ''}</label>
                        <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-black file:text-white hover:file:bg-gray-800" accept="image/*" onChange={e => setFormData({...formData, imagen: e.target.files[0]})} />
                    </div>

                    <button type="submit" className={`w-full flex justify-center items-center gap-2 text-white px-6 py-4 rounded-lg font-black uppercase text-lg shadow-lg transition-all transform hover:scale-[1.02] ${isEditing ? 'bg-gray-800' : 'bg-black hover:bg-gray-800'}`}>
                        {isEditing ? <Edit size={20} /> : <Plus size={20} />}
                        {isEditing ? 'Guardar Cambios' : 'Agregar Deporte'}
                    </button>
                </div>
            </form>

            <h3 className="text-2xl font-black uppercase mb-6 text-gray-800 border-l-4 border-black pl-3">Deportes Activos</h3>
            <div className="grid gap-4">
                {sports.map(s => (
                    <div key={s.id} className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all gap-4">
                        <div className="flex-grow">
                            <h4 className="font-bold text-xl text-gray-800 uppercase group-hover:text-black transition-colors">{s.nombre}</h4>
                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1">
                                <p className="text-sm font-bold text-gray-600 flex items-center gap-1">
                                    <User size={14} className="text-gray-400" /> {s.profesor || 'Sin asignar'}
                                </p>
                                <p className="text-sm font-bold text-black flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                                    <Clock size={14} /> {formatDateTime(s.dia_horario)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => handleEdit(s)} 
                                className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-gray-100 text-black px-4 py-2 rounded-lg font-bold hover:bg-black hover:text-white transition-all text-xs uppercase"
                            >
                                <Edit size={14} /> Editar
                            </button>
                            <button 
                                onClick={() => confirmDelete(s.id)} 
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

export default AdminSports;
