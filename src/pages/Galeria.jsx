import React, { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon, X, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';
import ImageViewer from '../components/ImageViewer';

const Galeria = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // Full event data with photos
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch list
        fetch(`${API_URL}/galeria`)
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const openEvent = async (id) => {
        try {
            const res = await fetch(`${API_URL}/galeria/${id}`);
            const data = await res.json();
            setSelectedEvent(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-black text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Galería</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        Reviví los mejores momentos de nuestro club.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="text-center py-20">Cargando...</div>
                ) : !Array.isArray(events) || events.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No hay eventos para mostrar.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <div 
                                key={event.id} 
                                onClick={() => openEvent(event.id)}
                                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={`${API_URL}${event.portada_url}`} 
                                        alt={event.titulo} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-1 rounded">
                                            {new Date(event.fecha).getFullYear()}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-black uppercase leading-none mb-2">{event.titulo}</h3>
                                    <p className="text-gray-500 font-bold text-sm flex items-center gap-2">
                                        <Calendar size={14} /> {new Date(event.fecha).toLocaleDateString()}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
                                        <span className="flex items-center gap-1 text-gray-400"><ImageIcon size={16} /> Ver fotos</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL VIEWER */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
                    <div className="min-h-screen px-4 py-12">
                        <button 
                            onClick={() => setSelectedEvent(null)}
                            className="fixed top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors z-50"
                        >
                            <X size={24} />
                        </button>

                        <div className="max-w-6xl mx-auto">
                            <div className="mb-12 text-center text-white">
                                <h2 className="text-4xl font-black uppercase mb-2">{selectedEvent.titulo}</h2>
                                <p className="text-gray-400">{new Date(selectedEvent.fecha).toLocaleDateString()}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Cover Image First */}
                                {selectedEvent.portada_url && (
                                    <div 
                                        className="rounded-xl overflow-hidden mb-4 col-span-full md:col-span-2 md:row-span-2 cursor-pointer hover:opacity-90"
                                        onClick={() => setFullScreenImage(`${API_URL}${selectedEvent.portada_url}`)}
                                    >
                                        <img src={`${API_URL}${selectedEvent.portada_url}`} className="w-full h-full object-cover" alt="Portada" />
                                    </div>
                                )}
                                
                                {selectedEvent.fotos && selectedEvent.fotos.map((foto, index) => (
                                    <div 
                                        key={index} 
                                        className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                                        onClick={() => setFullScreenImage(`${API_URL}${foto}`)}
                                    >
                                        <img src={`${API_URL}${foto}`} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <ImageViewer imageUrl={fullScreenImage} onClose={() => setFullScreenImage(null)} />
        </div>
    );
};

export default Galeria;
