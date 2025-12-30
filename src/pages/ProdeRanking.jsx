import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { getImageUrl } from '../utils/imageUtils';
import SponsorList from '../components/SponsorList';

const ProdeRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [topByMatchday, setTopByMatchday] = useState({ matchday: null, topPlayers: [] });
    const [teamStandings, setTeamStandings] = useState([]);
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
        
        // Fetch main ranking
        fetch(`${API_URL}/ranking?season=${selectedSeason}`)
            .then(res => res.json())
            .then(data => {
                setRanking(data);
            })
            .catch(console.error);

        // Fetch top players by matchday
        fetch(`${API_URL}/top-players-by-matchday?season=${selectedSeason}`)
            .then(res => res.json())
            .then(data => {
                setTopByMatchday(data);
            })
            .catch(console.error);

        // Fetch team standings
        fetch(`${API_URL}/team-standings?season=${selectedSeason}`)
            .then(res => res.json())
            .then(data => {
                setTeamStandings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedSeason]);

    if (loading && !selectedSeason) return <div className="p-8 text-center">Cargando Ranking...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
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

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Ranking - Left/Center (2 columns) */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Pos
                                    </th>
                                    <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Plenos <span className="hidden sm:inline">(3pts)</span>
                                    </th>
                                    <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-club-blue uppercase tracking-wider">
                                        Pts <span className="hidden sm:inline">Totales</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.map((row, index) => (
                                    <tr key={index} className={`hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                                        <td className="px-3 sm:px-5 py-4 sm:py-5 border-b border-gray-200 text-xs sm:text-sm">
                                            <div className={`
                                                flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm
                                                ${index === 0 ? 'bg-yellow-400 text-white' : 
                                                  index === 1 ? 'bg-gray-400 text-white' : 
                                                  index === 2 ? 'bg-orange-400 text-white' : 'text-gray-500'}
                                            `}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-5 py-4 sm:py-5 border-b border-gray-200 text-xs sm:text-sm">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
                                                    <img 
                                                        className="w-full h-full rounded-full object-cover border"
                                                        src={getImageUrl(row.foto_perfil) || "https://via.placeholder.com/150"}
                                                        alt={row.nombre}
                                                    />
                                                </div>
                                                <div className="ml-2 sm:ml-3">
                                                    <p className="text-gray-900 whitespace-no-wrap font-bold truncate max-w-[120px] sm:max-w-none">
                                                        {row.nombre} {row.apellido}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 sm:px-5 py-4 sm:py-5 border-b border-gray-200 text-xs sm:text-sm text-center">
                                            <span className="relative inline-block px-2 sm:px-3 py-1 font-semibold text-green-900 leading-tight">
                                                <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                <span className="relative">{row.plenos}</span>
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-5 py-4 sm:py-5 border-b border-gray-200 text-xs sm:text-sm text-center">
                                            <span className="text-lg sm:text-xl font-black text-club-dark">{row.total_points}</span>
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
                </div>
            </div>

                {/* Top Players by Matchday - Right Sidebar (1 column) */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-lg border-2 border-club-blue p-4 sm:p-6 sticky top-4">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-club-blue">
                            <span className="text-xl sm:text-2xl">🏆</span>
                            <h2 className="text-lg sm:text-xl font-black text-club-dark">
                                Mejores de la Fecha
                            </h2>
                        </div>
                        
                        {topByMatchday.matchday ? (
                            <>
                                <p className="text-sm font-semibold text-gray-600 mb-4 text-center bg-white rounded px-3 py-2 shadow-sm">
                                    {topByMatchday.matchday}
                                </p>
                                
                                <div className="space-y-3">
                                    {topByMatchday.topPlayers.map((player, index) => (
                                        <div 
                                            key={index} 
                                            className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-md ${
                                                index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white border border-gray-200'
                                            }`}
                                        >
                                            <div className={`
                                                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                                 ${index === 0 ? 'bg-yellow-500 text-white' : 
                                                  index === 1 ? 'bg-gray-400 text-white' : 
                                                  index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-300 text-gray-700'}
                                            `}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-shrink-0 w-10 h-10">
                                                <img 
                                                    className="w-full h-full rounded-full object-cover border-2 border-white shadow"
                                                    src={getImageUrl(player.foto_perfil) || "https://via.placeholder.com/150"}
                                                    alt={player.nombre}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                    {player.nombre} {player.apellido}
                                                </p>
                                                <div className="flex gap-2 text-xs text-gray-600">
                                                    <span className="font-semibold">⚽ {player.plenos} plenos</span>
                                                    {player.aciertos_parciales > 0 && (
                                                        <span>• {player.aciertos_parciales} parciales</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="bg-club-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-sm">
                                                    {player.matchday_points}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-500 text-sm py-8">
                                No hay fechas finalizadas aún
                            </p>
                        )}
                    </div>

                    {/* Team Standings Table */}
                    <div className="bg-white shadow-lg rounded-lg border border-gray-200 mt-6 overflow-hidden">
                        <div className="bg-gradient-to-r from-club-black to-gray-800 text-white p-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">📊</span>
                                <h2 className="text-lg font-black">Tabla de Posiciones</h2>
                            </div>
                        </div>
                        
                        {teamStandings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 py-2 text-left font-semibold text-gray-700">#</th>
                                            <th className="px-2 py-2 text-left font-semibold text-gray-700">Equipo</th>
                                            <th className="px-2 py-2 text-center font-semibold text-gray-700">PJ</th>
                                            <th className="px-2 py-2 text-center font-semibold text-gray-700">G</th>
                                            <th className="px-2 py-2 text-center font-semibold text-gray-700">E</th>
                                            <th className="px-2 py-2 text-center font-semibold text-gray-700">P</th>
                                            <th className="px-2 py-2 text-center font-semibold text-gray-700">GF</th>
                                            <th className="px-2 py-2 text-center font-semibold text-gray-700">GC</th>
                                            <th className="px-2 py-2 text-center font-semibold text-gray-700">DIF</th>
                                            <th className="px-2 py-2 text-center font-bold text-club-blue">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {teamStandings.map((team, index) => (
                                            <tr 
                                                key={index} 
                                                className={`hover:bg-gray-50 ${
                                                    index === 0 ? 'bg-green-50' : 
                                                    index < 4 ? 'bg-blue-50' : ''
                                                }`}
                                            >
                                                <td className="px-2 py-2 text-center">
                                                    <span className={`font-bold ${
                                                        index === 0 ? 'text-green-600' : 
                                                        index < 4 ? 'text-blue-600' : 'text-gray-600'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 font-semibold text-gray-900">{team.team}</td>
                                                <td className="px-2 py-2 text-center text-gray-700">{team.played}</td>
                                                <td className="px-2 py-2 text-center text-green-600 font-semibold">{team.won}</td>
                                                <td className="px-2 py-2 text-center text-gray-600">{team.drawn}</td>
                                                <td className="px-2 py-2 text-center text-red-600">{team.lost}</td>
                                                <td className="px-2 py-2 text-center text-gray-700">{team.goals_for}</td>
                                                <td className="px-2 py-2 text-center text-gray-700">{team.goals_against}</td>
                                                <td className={`px-2 py-2 text-center font-semibold ${
                                                    team.goal_difference > 0 ? 'text-green-600' : 
                                                    team.goal_difference < 0 ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                    {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <span className="font-black text-club-blue text-base">{team.points}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 text-sm py-6">
                                No hay datos de equipos aún
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <SponsorList location="prode" />
            </div>
        </div>
    );
};

export default ProdeRanking;
