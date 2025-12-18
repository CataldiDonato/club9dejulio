import React, { useState, useEffect } from 'react';
import { getTeamLogo } from '../utils/teamLogos';

const MatchCard = ({ match, prediction, onPredict }) => {
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

            <div className="bg-slate-50 p-3 rounded-lg w-full flex justify-center items-center gap-4">
                 <div className="flex flex-col items-center">
                    <label className="text-xs font-bold mb-1 text-gray-500">LOCAL</label>
                    <input 
                        type="number" 
                        min="0"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        disabled={locked}
                        className="w-16 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded focus:border-club-blue focus:outline-none disabled:bg-gray-200 disabled:text-gray-500"
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
                        disabled={locked}
                        className="w-16 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded focus:border-club-blue focus:outline-none disabled:bg-gray-200 disabled:text-gray-500"
                    />
                 </div>
            </div>

            {!locked && (
                <button 
                    onClick={handleSave}
                    className="mt-4 w-full bg-club-blue hover:bg-blue-700 text-black font-bold py-2 rounded transition-colors"
                >
                    Guardar Pronóstico
                </button>
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
        </div>
    );
};

export default MatchCard;
