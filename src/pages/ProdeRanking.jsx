import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import SponsorList from '../components/SponsorList';

const ProdeRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch seasons first
        fetch(`${API_URL}/seasons`)
            .then(res => res.json())
            .then(data => {
                setSeasons(data);
                if (data.length > 0) setSelectedSeason(data[0]); // Select latest
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedSeason) return;

        setLoading(true);
        fetch(`${API_URL}/ranking?season=${selectedSeason}`)
            .then(res => res.json())
            .then(data => {
                setRanking(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedSeason]);

    if (loading && !selectedSeason) return <div className="p-8 text-center">Cargando Ranking...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                 <h1 className="text-3xl font-bold text-club-dark border-l-4 border-club-blue pl-4">
                    Tabla de Posiciones
                </h1>
                
                {/* Season Selector */}
                <div className="flex items-center gap-2">
                    <label className="font-bold text-gray-600">Temporada:</label>
                    <select 
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className="border-2 border-club-blue rounded px-3 py-1 font-bold text-club-dark bg-white"
                    >
                        {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Pos
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Plenos (3pts)
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-club-blue uppercase tracking-wider">
                                Puntos Totales
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((row, index) => (
                            <tr key={index} className={`hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-full font-bold
                                        ${index === 0 ? 'bg-yellow-400 text-white' : 
                                          index === 1 ? 'bg-gray-400 text-white' : 
                                          index === 2 ? 'bg-orange-400 text-white' : 'text-gray-500'}
                                    `}>
                                        {index + 1}
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10">
                                            <img 
                                                className="w-full h-full rounded-full object-cover border"
                                                src={row.foto_perfil || "https://via.placeholder.com/150"}
                                                alt={row.nombre}
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-900 whitespace-no-wrap font-bold">
                                                {row.nombre} {row.apellido}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                        <span className="relative">{row.plenos}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                                    <span className="text-xl font-black text-club-dark">{row.total_points}</span>
                                </td>
                            </tr>
                        ))}
                        {ranking.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-5 py-5 text-center text-gray-500">
                                    Aún no hay puntos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-12">
                <SponsorList location="prode" />
            </div>
        </div>
    );
};

export default ProdeRanking;
