import React, { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard';
import ConfirmationModal from '../components/ConfirmationModal';
import { API_URL } from '../config';

const ProdeJugar = () => {
    const [matches, setMatches] = useState([]);
    const [myPredictions, setMyPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Matches and Predictions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token =  localStorage.getItem('token');
                
                // 0. Get Latest Season
                const seasonsRes = await fetch(`${API_URL}/seasons`);
                const seasons = await seasonsRes.json();
                const currentSeason = seasons.length > 0 ? seasons[0] : new Date().getFullYear().toString();

                // 1. Get Matches for Current Season
                const matchesRes = await fetch(`${API_URL}/matches?season=${currentSeason}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!matchesRes.ok) {
                    if (matchesRes.status === 401 || matchesRes.status === 403) {
                        throw new Error('Sesión expirada. Por favor, iniciá sesión nuevamente.');
                    }
                    throw new Error('Error al cargar partidos');
                }
                const matchesData = await matchesRes.json();

                // 2. Get My Predictions
                const predsRes = await fetch(`${API_URL}/predictions/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!predsRes.ok) {
                     if (predsRes.status === 401 || predsRes.status === 403) {
                        throw new Error('Sesión expirada. Por favor, iniciá sesión nuevamente.');
                    }
                    throw new Error('Error al cargar pronósticos');
                }
                const predsData = await predsRes.json();

                setMatches(matchesData);
                setMyPredictions(predsData);
            } catch (err) {
                console.error(err);
                setError(err.message);
                if (err.message.includes('Sesión expirada')) {
                    // Optional: Auto redirect after few seconds or provide a button
                    setTimeout(() => window.location.href = '/socios', 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [modal, setModal] = useState({ isOpen: false, data: null });

    const handlePredictRequest = (matchId, homeScore, awayScore) => {
        setModal({
            isOpen: true,
            data: { matchId, homeScore, awayScore },
            title: 'Confirmar Pronóstico',
            message: `¿Estás seguro que quieres guardar este resultado: ${homeScore} - ${awayScore}?`
        });
    };

    const confirmPredict = () => {
        if (!modal.data) return;
        const { matchId, homeScore, awayScore } = modal.data;
        // Logic from previous handlePredict
        
        const save = async () => {
             try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/predictions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ match_id: matchId, home_score: homeScore, away_score: awayScore })
                });
    
                if (!res.ok) {
                    const errorData = await res.json();
                    alert(errorData.error || 'Error al guardar');
                    return;
                }
    
                const newTx = await res.json();
                
                // Update local state
                setMyPredictions(prev => {
                    const existing = prev.find(p => p.match_id === matchId);
                    if (existing) {
                        return prev.map(p => p.match_id === matchId ? newTx : p);
                    } else {
                        return [...prev, newTx];
                    }
                });
                
                // alert('¡Pronóstico guardado!'); // Optional if modal success needed, but maybe notification is enough or just close
            } catch (err) {
                console.error(err);
                alert('Error de conexión');
            }
        };
        save();
    };

    if (loading) return <div className="p-8 text-center">Cargando Prode...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    const activeMatches = matches.filter(m => m.status !== 'finished');
    const finishedMatches = matches.filter(m => m.status === 'finished');

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 relative">
            <ConfirmationModal 
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={confirmPredict}
                title={modal.title}
                message={modal.message}
            />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-club-dark border-l-4 border-club-blue pl-4">
                    Jugar Prode
                </h1>
                <div className="text-sm text-gray-500">
                    <span className="font-bold">{myPredictions.length}</span> pronósticos realizados
                </div>
            </div>

            {/* Partidos por Jugar */}
            <h2 className="text-xl font-bold mb-4 text-gray-700">Próximos Partidos</h2>
            {activeMatches.length === 0 ? (
                <p className="text-gray-500 italic mb-8">No hay partidos programados.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {activeMatches.map(match => (
                        <MatchCard 
                            key={match.id} 
                            match={match} 
                            prediction={myPredictions.find(p => p.match_id === match.id)}
                            onPredict={handlePredictRequest} 
                        />
                    ))}
                </div>
            )}

            {/* Partidos Finalizados */}
            {finishedMatches.length > 0 && (
                <>
                    <h2 className="text-xl font-bold mb-4 text-gray-700 border-t pt-8">Resultados Anteriores</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {finishedMatches.map(match => (
                            <MatchCard 
                                key={match.id} 
                                match={match} 
                                prediction={myPredictions.find(p => p.match_id === match.id)}
                                onPredict={handlePredictRequest}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProdeJugar;
