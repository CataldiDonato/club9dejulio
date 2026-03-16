import React, { useState, useEffect } from 'react';
import { User, ThumbsUp, Medal, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../config';

const JugadorDeLaFecha = () => {
    const [jugadores, setJugadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [message, setMessage] = useState(null);
    const [fechaActual, setFechaActual] = useState("");

    useEffect(() => {
        fetchJugadores();
    }, []);

    const fetchJugadores = async () => {
        try {
            // Fetch Jugador de la fecha
            const res = await fetch(`${API_URL}/jugadores-fecha`, { credentials: 'include' });
            const data = await res.json();
            setJugadores(data.jugadores || []);
            setFechaActual(data.session?.name || "Fecha Actual");
        } catch (err) {
            console.error("Error fetching players:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (jugadorId) => {
        setVoting(true);
        setMessage(null);
        try {
            const res = await fetch(`${API_URL}/votar-jugador`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    jugador_id: jugadorId
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                fetchJugadores();
            } else {
                setMessage({ type: 'error', text: data.error || "Error al votar" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Error de conexión" });
        } finally {
            setVoting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
            {/* Header Reducido para Mobile */}
            <div className="text-center mb-8">
                <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border border-blue-100">
                    🏆 Elige a tu figura
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-gray-900 leading-none">
                    Jugador <br className="sm:hidden" /> de la Fecha
                </h1>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    {fechaActual}
                </p>
                <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Feedback Message Flotante o Simple */}
            {message && (
                <div className={`fixed bottom-4 left-4 right-4 z-50 p-4 rounded-2xl flex items-center shadow-2xl border animate-bounce-short ${message.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 'bg-red-600 border-red-500 text-white'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="mr-3 shrink-0" size={20} /> : <AlertCircle className="mr-3 shrink-0" size={20} />}
                    <span className="font-bold text-sm">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto text-white/50 text-xs font-bold uppercase">Cerrar</button>
                </div>
            )}

            {/* Grid de 2 Columnas en Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                {jugadores.map((jugador, index) => (
                    <div
                        key={jugador.id}
                        className="relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col"
                    >
                        {/* Indicador de posición simplificado */}
                        <div className="absolute top-2 left-2 z-10">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${index === 0 ? 'bg-yellow-400' :
                                index === 1 ? 'bg-gray-400' :
                                    index === 2 ? 'bg-orange-400' : 'bg-blue-600'
                                }`}>
                                {index + 1}
                            </div>
                        </div>

                        {/* Imagen Cuadrada (Aspect Square) */}
                        <div className="aspect-square overflow-hidden bg-gray-100 relative">
                            <img
                                src={jugador.imagen_url ? (jugador.imagen_url.startsWith('http') ? jugador.imagen_url : `${API_URL.replace('/api', '')}${jugador.imagen_url}`) : "https://via.placeholder.com/400x400?text=Jugador"}
                                alt={jugador.nombre}
                                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                            />
                            {/* Overlay de gradiente para el nombre */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
                                <h3 className="text-white text-xs font-bold uppercase truncate leading-tight">
                                    {jugador.nombre}
                                </h3>
                            </div>
                        </div>

                        {/* Footer de la Card */}
                        <div className="p-3 flex flex-col flex-grow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Votos</span>
                                <span className="text-sm font-black text-blue-600">{jugador.votos}</span>
                            </div>

                            <button
                                onClick={() => handleVote(jugador.id)}
                                disabled={voting}
                                className={`w-full py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center ${voting
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-blue-600 active:scale-95'
                                    }`}
                            >
                                {voting ? (
                                    <div className="h-3 w-3 border-2 border-gray-300 border-t-blue-600 animate-spin rounded-full"></div>
                                ) : (
                                    'Votar'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {jugadores.length === 0 && !loading && (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mx-2">
                    <User size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-xs font-bold uppercase">No hay jugadores para esta fecha</p>
                </div>
            )}
        </div>
    );
};

export default JugadorDeLaFecha;
