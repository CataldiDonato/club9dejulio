import React, { useState, useEffect } from 'react';
import { TEAMS } from '../data/teams';
import ConfirmationModal from '../components/ConfirmationModal';
import { API_URL } from '../config';

const AdminProde = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        home_team: TEAMS[0],
        away_team: TEAMS[1],
        start_time: '',
        matchday: 'Fecha 1'
    });
    
    // Modal State
    const [modal, setModal] = useState({ isOpen: false, type: null, data: null });

    // Auth check should be here or handled by a higher-level component/router, but basic check:
    const token = localStorage.getItem('token');

    const fetchMatches = async () => {
        try {
            const res = await fetch(`${API_URL}/matches`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401 || res.status === 403) {
                alert('Tu sesión como administrador ha expirado o no tienes permisos. Redirigiendo...');
                window.location.href = '/socios';
                return;
            }
            if (!res.ok) throw new Error('Error al cargar partidos');
            
            const data = await res.json();
            setMatches(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Error al cargar datos: ' + err.message);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Pre-Request Triggers
    const requestCreateMatch = (e) => {
        e.preventDefault();
        setModal({
            isOpen: true,
            type: 'CREATE',
            title: 'Crear Partido',
            message: `¿Crear partido ${formData.home_team} vs ${formData.away_team} para la ${formData.matchday}?`
        });
    };

    const requestSetResult = (matchId, homeScore, awayScore) => {
        if (homeScore === undefined || awayScore === undefined) return;
        setModal({
            isOpen: true,
            type: 'RESULT',
            data: { matchId, homeScore, awayScore },
            title: 'Finalizar Partido',
            message: `¿Confirmar resultado ${homeScore} - ${awayScore} y calcular puntos para TODOS los usuarios? Esta acción es importante.`,
            isDestructive: true
        });
    };

    // Action Executors
    const executeAction = async () => {
        if (modal.type === 'CREATE') {
            await handleCreateMatch();
        } else if (modal.type === 'RESULT') {
            await handleSetResult();
        }
    };

    const handleCreateMatch = async () => {
        try {
            const res = await fetch(`${API_URL}/matches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // alert('Partido creado'); // Modal auto-close implies success or we can toast
                fetchMatches();
                setFormData(prev => ({ ...prev, start_time: '' }));
            } else {
                alert('Error al crear partido');
            }
        } catch (err) {
            console.error(err);
            alert('Error al crear');
        }
    };

    const handleSetResult = async () => {
        const { matchId, homeScore, awayScore } = modal.data;
        try {
            const res = await fetch(`${API_URL}/matches/${matchId}/result`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ home_score: homeScore, away_score: awayScore })
            });

            if (res.ok) {
                // alert('Resultado guardado y puntos calculados');
                fetchMatches();
            } else {
                alert('Error al guardar resultado');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 relative">
             <ConfirmationModal 
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={executeAction}
                title={modal.title}
                message={modal.message}
                isDestructive={modal.isDestructive}
            />

            <h1 className="text-3xl font-bold mb-8">Administrar Prode</h1>

            {/* Create Match Form - Protected for Admin Only on Frontend too */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="font-bold text-blue-700">Gestión de Temporadas</p>
                <p className="text-sm text-blue-600">
                    El sistema detecta automáticamente la temporada actual basada en los partidos creados. 
                    Para <strong>finalizar la temporada actual</strong> e iniciar una nueva (ej: 2026), simplemente cree el primer partido asignándole el año nuevo en el campo "Temporada".
                    La vista de "Jugar" cambiará automáticamente a mostrar solo los partidos del nuevo año.
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">Crear Nuevo Partido</h2>
                <form onSubmit={requestCreateMatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-bold mb-1">Local</label>
                        <select 
                            name="home_team" 
                            value={formData.home_team} 
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Visitante</label>
                        <select 
                            name="away_team" 
                            value={formData.away_team} 
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Fecha y Hora</label>
                        <input 
                            type="datetime-local" 
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Jornada</label>
                        <input 
                            type="text" 
                            name="matchday"
                            value={formData.matchday}
                            onChange={handleChange}
                            placeholder="Ej: Fecha 1"
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Temporada (Año)</label>
                        <input 
                            type="text" 
                            name="season"
                            value={formData.season || new Date().getFullYear().toString()}
                            onChange={handleChange}
                            placeholder="2025"
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                        Crear Partido
                    </button>
                </form>
            </div>

            {/* Match List */}
            <h2 className="text-xl font-bold mb-4">Partidos Existentes</h2>
            {loading ? <p>Cargando...</p> : (
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Partido</th>
                                    <th className="px-4 py-2 text-left">Fecha</th>
                                    <th className="px-4 py-2 text-left">Estado</th>
                                    <th className="px-4 py-2 text-left">Resultado</th>
                                    <th className="px-4 py-2 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map(m => (
                                    <tr key={m.id} className="border-t">
                                        <td className="px-4 py-2">{m.id}</td>
                                        <td className="px-4 py-2 font-bold whitespace-nowrap">{m.home_team} vs {m.away_team}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {new Date(m.start_time).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                m.status === 'finished' ? 'bg-gray-800 text-white' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {m.status === 'finished' ? 'Finalizado' : 'Programado'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {m.status === 'finished' ? (
                                                <span className="font-bold text-lg">{m.home_score} - {m.away_score}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-2">
                                            <ResultForm 
                                                matchId={m.id} 
                                                onSave={requestSetResult} 
                                                initialHome={m.home_score}
                                                initialAway={m.away_score}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// Mini component for result input
const ResultForm = ({ matchId, onSave, initialHome, initialAway }) => {
    const [h, setH] = useState(initialHome !== undefined && initialHome !== null ? initialHome : '');
    const [a, setA] = useState(initialAway !== undefined && initialAway !== null ? initialAway : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(matchId, parseInt(h), parseInt(a));
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <input 
                type="number" 
                placeholder="L" 
                className="w-12 border rounded p-1 text-center"
                value={h}
                onChange={e => setH(e.target.value)}
                required
            />
            <span>-</span>
            <input 
                type="number" 
                placeholder="V" 
                className="w-12 border rounded p-1 text-center"
                value={a}
                onChange={e => setA(e.target.value)}
                required
            />
            <button type="submit" className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Finalizar
            </button>
        </form>
    );
};

export default AdminProde;
