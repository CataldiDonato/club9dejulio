import React, { useState, useEffect } from 'react';
import { getTeamLogo } from '../utils/teamLogos';

const MatchCard = ({ match, prediction, stats, onPredict }) => {
    // ... existing hooks ...
    const [homeScore, setHomeScore] = useState(prediction?.home_score || '');
    const [awayScore, setAwayScore] = useState(prediction?.away_score || '');
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        const checkLock = () => {
             const now = new Date();
             const start = new Date(match.start_time);
             // Lock 2 hours before
             const lockTime = new Date(start.getTime() - 2 * 60 * 60 * 1000);
             setLocked(now >= lockTime || match.status === 'finished');
        };
        checkLock();
        const timer = setInterval(checkLock, 60000); // Check every minute
        return () => clearInterval(timer);
    }, [match]);

    useEffect(() => {
        if (prediction) {
            setHomeScore(prediction.home_score);
            setAwayScore(prediction.away_score);
        }
    }, [prediction]);

    const handleSave = () => {
        if (homeScore === '' || awayScore === '') return;
        onPredict(match.id, parseInt(homeScore), parseInt(awayScore));
    };

    // Calculate status color/ badge
    const getStatusBadge = () => {
        if (match.status === 'finished') return <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Finalizado</span>;
        if (locked) return <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Cerrado</span>;
        return <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Abierto</span>;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const homeLogo = getTeamLogo(match.home_team);
    const awayLogo = getTeamLogo(match.away_team);

    // Stats Color Logic
    const getBarColor = (value, allValues) => {
        const max = Math.max(...allValues);
        const min = Math.min(...allValues);
        
        if (allValues.every(v => v === 0)) return 'bg-gray-200';
        if (value === max) return 'bg-green-500';
        if (value === min && value !== max) return 'bg-red-500'; // Only red if strictly min and not equal to max (e.g. all equal)
        return 'bg-yellow-400'; // Intermediate
    };

    const renderStats = () => {
        if (!stats || stats.total === 0) return null;
        
        const { home_pct, draw_pct, away_pct } = stats;
        const values = [home_pct, draw_pct, away_pct];

        return (
            <div className="mt-4 pt-3 border-t border-gray-100 w-full">
                <p className="text-[10px] text-gray-400 font-bold uppercase text-center mb-2">Tendencia de Votos ({stats.total})</p>
                <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden mb-1">
                    <div className={`h-full ${getBarColor(home_pct, values)} transition-all`} style={{ width: `${home_pct}%` }}></div>
                    <div className={`h-full ${getBarColor(draw_pct, values)} transition-all`} style={{ width: `${draw_pct}%` }}></div>
                    <div className={`h-full ${getBarColor(away_pct, values)} transition-all`} style={{ width: `${away_pct}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500 px-1">
                   <span className={home_pct === Math.max(...values) ? 'text-green-600' : ''}>{home_pct}% Local</span>
                   <span className={draw_pct === Math.max(...values) ? 'text-green-600' : ''}>{draw_pct}% Empate</span>
                   <span className={away_pct === Math.max(...values) ? 'text-green-600' : ''}>{away_pct}% Visita</span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase">{match.matchday}</span>
                {getStatusBadge()}
            </div>
            
            <div className="flex justify-between items-center w-full mb-4 gap-2">
                <div className="text-center flex-1 flex flex-col items-center">
                    {homeLogo && <img src={homeLogo} alt={match.home_team} className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2" />}
                    <div className={`font-bold text-sm md:text-lg leading-tight break-words max-w-[100px] md:max-w-none ${match.status === 'finished' && match.home_score > match.away_score ? 'text-green-600 underline decoration-4' : 'text-club-dark'}`}>
                        {match.home_team}
                    </div>
                </div>
                <div className="text-center flex-shrink-0 flex flex-col items-center px-2">
                    <span className="text-xs text-gray-500 mb-1">{formatDate(match.start_time)}</span>
                    <div className="font-black text-xl md:text-2xl text-gray-300">VS</div>
                </div>
                <div className="text-center flex-1 flex flex-col items-center">
                    {awayLogo && <img src={awayLogo} alt={match.away_team} className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2" />}
                    <div className={`font-bold text-sm md:text-lg leading-tight break-words max-w-[100px] md:max-w-none ${match.status === 'finished' && match.away_score > match.home_score ? 'text-green-600 underline decoration-4' : 'text-club-dark'}`}>
                         {match.away_team}
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg w-full flex justify-center items-center gap-4 relative">
                 {/* Status Indicator inside input area */}
                 {prediction && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            {prediction.update_count >= 2 ? 'Sin Cambios' : 'Guardado'}
                        </span>
                    </div>
                 )}

                 <div className="flex flex-col items-center">
                    <label className="text-xs font-bold mb-1 text-gray-500">LOCAL</label>
                    <input 
                        type="number" 
                        min="0"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        disabled={locked || (prediction?.update_count >= 2)}
                        className="w-16 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded focus:border-club-blue focus:outline-none disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                 </div>
                 <span className="text-gray-400 font-bold">-</span>
                 <div className="flex flex-col items-center">
                    <label className="text-xs font-bold mb-1 text-gray-500">VISITA</label>
                    <input 
                        type="number" 
                        min="0"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        disabled={locked || (prediction?.update_count >= 2)}
                        className="w-16 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded focus:border-club-blue focus:outline-none disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                 </div>
            </div>
            
            {prediction && prediction.update_count < 2 && !locked && (
                <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase text-center">
                    Te quedan {2 - prediction.update_count} {2 - prediction.update_count === 1 ? 'cambio' : 'cambios'} posibles.
                </p>
            )}

            {!locked && !(prediction?.update_count >= 2) && (
                <button 
                    onClick={handleSave}
                    className="mt-2 w-full bg-club-blue hover:bg-blue-700 text-black font-bold py-2 rounded transition-colors text-sm uppercase"
                >
                    {prediction ? 'Actualizar Pronóstico' : 'Guardar Pronóstico'}
                </button>
            )}
            
            {!locked && prediction?.update_count >= 2 && (
                <div className="mt-2 w-full bg-gray-200 text-gray-500 font-bold py-2 rounded text-center text-xs uppercase border border-gray-300">
                    Límite de cambios alcanzado
                </div>
            )}

            {match.status === 'finished' && (
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase">Resultado Real</p>
                    <p className="text-xl font-black text-club-dark">
                        {match.home_score} - {match.away_score}
                    </p>
                    {prediction && (
                        <div className={`mt-2 text-xs font-bold px-2 py-1 rounded inline-block ${
                            prediction.points === 3 ? 'bg-green-100 text-green-800' : 
                            prediction.points === 1 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                        }`}>
                            Puntos: {prediction.points}
                        </div>
                    )}
                </div>
            )}

            {renderStats()}
        </div>
    );
};

export default MatchCard;
