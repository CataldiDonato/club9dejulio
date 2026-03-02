import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';
import { getImageUrl } from '../utils/imageUtils';
import SponsorList from '../components/SponsorList';
import html2canvas from 'html2canvas';
import { Share2, Download, Camera } from 'lucide-react';

const ProdeRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [topByMatchday, setTopByMatchday] = useState({ matchday: null, topPlayers: [] });
    const [teamStandings, setTeamStandings] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [loading, setLoading] = useState(true);
    const [sharing, setSharing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const rankingRef = useRef(null);
    const standingsRef = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        setCurrentPage(1); // Reset to page 1 on season change

        // Fetch main ranking
        fetch(`${API_URL}/ranking?season=${selectedSeason}`)
            .then(res => res.json())
            .then(data => {
                setRanking(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error(err);
                setRanking([]);
            });

        // Fetch top players by matchday
        fetch(`${API_URL}/top-players-by-matchday?season=${selectedSeason}`)
            .then(res => res.json())
            .then(data => {
                setTopByMatchday(data && data.topPlayers ? data : { matchday: null, topPlayers: [] });
            })
            .catch(err => {
                console.error(err);
                setTopByMatchday({ matchday: null, topPlayers: [] });
            });

        // Fetch team standings
        fetch(`${API_URL}/team-standings?season=${selectedSeason}`)
            .then(res => res.json())
            .then(data => {
                setTeamStandings(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedSeason]);

    const safeRanking = Array.isArray(ranking) ? ranking : [];
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Filtered ranking based on search term
    const filteredRanking = safeRanking.filter(user =>
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic using filtered results
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRanking = filteredRanking.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRanking.length / itemsPerPage);

    const handleShare = async (ref, title) => {
        if (!ref.current || sharing) return;

        setSharing(true);
        try {
            const today = new Date().toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-');

            const finalTitle = `${title} ${today} LIF`;

            // Give time for any UI updates
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(ref.current, {
                useCORS: true,
                scale: 2, // Higher quality
                backgroundColor: '#ffffff',
                logging: false,
                onclone: (clonedDoc) => {
                    // Hide sharing buttons in the screenshot
                    const buttons = clonedDoc.querySelectorAll('.share-btn-hidden');
                    buttons.forEach(b => b.style.display = 'none');
                }
            });

            const dataUrl = canvas.toDataURL('image/png');

            let shared = false;
            // Try to use the native share API
            if (navigator.share && navigator.canShare) {
                try {
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], `${finalTitle}.png`, { type: 'image/png' });

                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: finalTitle,
                            text: finalTitle
                        });
                        shared = true;
                    }
                } catch (shareErr) {
                    console.warn('Native share failed, falling back to download:', shareErr);
                }
            }

            // Fallback to direct download if share failed or wasn't available
            if (!shared) {
                downloadImage(dataUrl, finalTitle);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            alert('No se pudo generar la imagen. Intenta de nuevo.');
        } finally {
            setSharing(false);
        }
    };

    const downloadImage = (dataUrl, title) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${title}.png`;
        link.click();
    };

    if (loading && !selectedSeason) return <div className="p-8 text-center">Cargando Ranking...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-club-dark border-l-4 border-black pl-4">
                    Tabla de Posiciones
                </h1>

                {/* Season Selector */}
                <div className="flex items-center gap-2">
                    <label className="font-bold text-gray-600">Temporada:</label>
                    <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className="border-2 border-black rounded px-3 py-1 font-bold text-club-dark bg-white outline-none"
                    >
                        {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Ranking - Left/Center (2 columns) */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200" ref={rankingRef}>
                        <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-center gap-3">
                            <h2 className="font-bold text-gray-700">Ranking Prode</h2>

                            {/* Search Input */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Buscar usuario..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1); // Reset to page 1 on search
                                    }}
                                    className="w-full px-4 py-1.5 text-sm border-2 border-gray-200 rounded-full focus:border-black outline-none transition-colors pl-9"
                                />
                                <svg
                                    className="absolute left-3 top-2 w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <button
                                onClick={() => handleShare(rankingRef, 'Ranking Prode')}
                                disabled={sharing}
                                className="share-btn-hidden flex items-center gap-2 px-3 py-1 bg-club-dark text-white rounded-md hover:bg-black transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                <Share2 size={16} />
                                {sharing ? 'Generando...' : 'Compartir'}
                            </button>
                        </div>
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
                                        <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-black uppercase tracking-wider">
                                            Pts <span className="hidden sm:inline">Totales</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRanking.map((row, idx) => {
                                        const index = indexOfFirstItem + idx;
                                        return (
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
                                                                src={getImageUrl(row.foto_perfil) || "https://placehold.co/150x150?text=9J"}
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
                                        );
                                    })}
                                    {ranking.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-5 text-center text-gray-500">
                                                Aún no hay puntos registrados.
                                            </td>
                                        </tr>
                                    ) : filteredRanking.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-5 text-center text-gray-500 italic">
                                                No se encontraron resultados para "{searchTerm}"
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>

                {/* Top Players by Matchday - Right Sidebar (1 column) */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-lg rounded-lg border-2 border-black p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-black">
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
                                            className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-md ${index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white border border-gray-200'
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
                                                    src={getImageUrl(player.foto_perfil) || "https://placehold.co/150x150?text=9J"}
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
                                                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-sm">
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
                    <div id="tabla" className="bg-white shadow-lg rounded-lg border border-gray-200 mt-6 overflow-hidden" ref={standingsRef}>

                        <div className="bg-gradient-to-r from-club-black to-gray-800 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">📊</span>
                                <h2 className="text-lg font-black">Tabla de Posiciones</h2>
                            </div>
                            <button
                                onClick={() => handleShare(standingsRef, 'Tabla de Posiciones')}
                                disabled={sharing}
                                className="share-btn-hidden flex items-center gap-2 px-3 py-1 bg-white text-black rounded-md hover:bg-gray-200 transition-colors text-sm font-bold disabled:opacity-50"
                            >
                                <Camera size={16} />
                                {sharing ? '...' : 'Compartir'}
                            </button>
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
                                            <th className="px-2 py-2 text-center font-bold text-black">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {teamStandings.map((team, index) => (
                                            <tr
                                                key={index}
                                                className={`hover:bg-gray-100 transition-colors ${index === 0 ? 'bg-green-50' :
                                                    index < 8 ? 'bg-gray-100 border-l-4 border-l-gray-400' : ''
                                                    }`}
                                            >
                                                <td className="px-2 py-2 text-center">
                                                    <span className={`font-bold ${index === 0 ? 'text-green-600' :
                                                        index < 8 ? 'text-black font-black' : 'text-gray-600'
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
                                                <td className={`px-2 py-2 text-center font-semibold ${team.goal_difference > 0 ? 'text-green-600' :
                                                    team.goal_difference < 0 ? 'text-red-600' : 'text-gray-600'
                                                    }`}>
                                                    {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <span className="font-black text-black text-base">{team.points}</span>
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


        </div>
    );
};

export default ProdeRanking;
