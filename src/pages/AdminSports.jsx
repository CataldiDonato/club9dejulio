import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const AdminSports = () => {
    const [sports, setSports] = useState([]);
    const [newSport, setNewSport] = useState({ nombre: '', dia_horario: '', profesor: '', descripcion: '', imagen: null });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        const res = await fetch(`${API_URL}/deportes`);
        const data = await res.json();
        setSports(data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('nombre', newSport.nombre);
        formData.append('dia_horario', newSport.dia_horario);
        formData.append('profesor', newSport.profesor);
        formData.append('descripcion', newSport.descripcion);
        if (newSport.imagen) {
            formData.append('imagen', newSport.imagen);
        }

        const res = await fetch(`${API_URL}/deportes`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
            body: formData
        });

        if (res.ok) {
            setMessage('Deporte agregado correctamente!');
            setNewSport({ nombre: '', dia_horario: '', profesor: '', descripcion: '', imagen: null });
            fetchSports();
        } else {
            setMessage('Error al crear deporte');
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!confirm('¿Seguro que querés borrar este deporte?')) return;

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
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-black uppercase mb-8">Administrar Deportes</h2>
            
            {message && <div className="bg-green-100 p-4 rounded mb-4 text-green-800 font-bold">{message}</div>}

            <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-lg border mb-12">
                <h3 className="text-xl font-bold mb-4">Nuevo Deporte</h3>
                <div className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Nombre (ej: Fútbol)" value={newSport.nombre} onChange={e => setNewSport({...newSport, nombre: e.target.value})} required />
                    <input className="w-full border p-2 rounded" placeholder="Días y Horarios" value={newSport.dia_horario} onChange={e => setNewSport({...newSport, dia_horario: e.target.value})} />
                    <input className="w-full border p-2 rounded" placeholder="Profesor / Encargado" value={newSport.profesor} onChange={e => setNewSport({...newSport, profesor: e.target.value})} />
                    <textarea className="w-full border p-2 rounded h-24" placeholder="Breve descripción" value={newSport.descripcion} onChange={e => setNewSport({...newSport, descripcion: e.target.value})} />
                    <input type="file" className="w-full border p-2 rounded" accept="image/*" onChange={e => setNewSport({...newSport, imagen: e.target.files[0]})} />
                    <button type="submit" className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800">AGREGAR DEPORTE</button>
                </div>
            </form>

            <h3 className="text-xl font-bold mb-4">Deportes Activos</h3>
            <div className="space-y-4">
                {sports.map(s => (
                    <div key={s.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded shadow border gap-4">
                        <div>
                            <h4 className="font-bold text-lg">{s.nombre}</h4>
                            <p className="text-sm text-gray-500">{s.profesor} | {s.dia_horario}</p>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="text-red-600 font-bold hover:underline self-end md:self-auto">ELIMINAR</button>
                    </div>
                ))}
            </div>
            
            <button onClick={() => window.location.href='/socios'} className="mt-8 text-black underline">Volver al Dashboard</button>
        </div>
    );
};

export default AdminSports;
