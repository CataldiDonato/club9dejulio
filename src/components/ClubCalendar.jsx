import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Newspaper, Camera, X } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const ClubCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // News Detail Modal State
    const [selectedNews, setSelectedNews] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingNews, setLoadingNews] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [newsRes, sportsRes, galleryRes] = await Promise.all([
                fetch(`${API_URL}/noticias`),
                fetch(`${API_URL}/deportes`),
                fetch(`${API_URL}/galeria`)
            ]);

            const news = await newsRes.json();
            const sports = await sportsRes.json();
            const gallery = await galleryRes.json();

            // Normalizar eventos
            const allEvents = [
                ...news.map(n => ({ ...n, type: 'noticia', date: new Date(n.fecha) })),
                ...sports.map(s => ({ ...s, type: 'deporte', date: new Date(s.dia_horario) })),
                ...gallery.map(g => ({ ...g, type: 'evento', date: new Date(g.fecha) }))
            ].filter(e => !isNaN(e.date.getTime()));

            setEvents(allEvents);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenNews = async (id) => {
        setLoadingNews(true);
        setIsModalOpen(true);
        try {
            const res = await fetch(`${API_URL}/noticias/${id}`);
            const data = await res.json();
            setSelectedNews(data);
        } catch (error) {
            console.error('Error fetching news detail:', error);
        } finally {
            setLoadingNews(false);
        }
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderHeader = () => {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return (
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <CalendarIcon size={28} /> {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border shadow-sm"><ChevronLeft /></button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border shadow-sm"><ChevronRight /></button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const calendarDays = [];

        // Vacíos antes del primer día
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-24 border-b border-r bg-gray-50/50"></div>);
        }

        // Días del mes
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const dayEvents = events.filter(e => 
                e.date.getDate() === day && 
                e.date.getMonth() === month && 
                e.date.getFullYear() === year
            );

            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDay && date.toDateString() === selectedDay.toDateString();

            calendarDays.push(
                <div 
                    key={day} 
                    onClick={() => setSelectedDay(date)}
                    className={`h-24 border-b border-r p-2 cursor-pointer transition-all hover:bg-club-gray relative group ${isSelected ? 'ring-2 ring-black bg-white z-10' : 'bg-white'}`}
                >
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-black text-white' : 'text-gray-400 group-hover:text-black'}`}>
                        {day}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                        {dayEvents.map((e, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full ${e.type === 'noticia' ? 'bg-black' : e.type === 'deporte' ? 'bg-blue-600' : 'bg-red-500'}`} title={e.titulo || e.nombre}></div>
                        ))}
                    </div>
                    {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 right-2 text-[10px] font-black text-gray-300 opacity-0 group-hover:opacity-100 uppercase tracking-tighter">
                            {dayEvents.length} {dayEvents.length === 1 ? 'Evento' : 'Eventos'}
                        </div>
                    )}
                </div>
            );
        }

        return <div className="grid grid-cols-7 border-t border-l rounded-xl overflow-hidden shadow-2xl">{calendarDays}</div>;
    };

    const renderEventDetails = () => {
        if (!selectedDay) return (
            <div className="bg-gray-50 p-12 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                 <CalendarIcon size={48} className="text-gray-300 mb-4" />
                 <p className="text-gray-500 font-bold uppercase text-sm tracking-widest">Seleccioná un día para ver la actividad</p>
            </div>
        );

        const dayEvents = events.filter(e => 
            e.date.getDate() === selectedDay.getDate() && 
            e.date.getMonth() === selectedDay.getMonth() && 
            e.date.getFullYear() === selectedDay.getFullYear()
        );

        return (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-1 bg-black"></div>
                    <h3 className="font-black text-xl uppercase tracking-tight">Actividad del {selectedDay.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</h3>
                </div>
                {dayEvents.length === 0 ? (
                    <p className="text-gray-400 italic font-medium">No hay eventos programados para este día.</p>
                ) : (
                    <div className="grid gap-4">
                        {dayEvents.map((e, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => e.type === 'noticia' && handleOpenNews(e.id)}
                                className={`flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group ${e.type === 'noticia' ? 'cursor-pointer' : ''}`}
                            >
                                <div className={`p-3 rounded-lg ${
                                    e.type === 'noticia' ? 'bg-black text-white' : 
                                    e.type === 'deporte' ? 'bg-blue-600 text-white' : 
                                    'bg-red-500 text-white'
                                }`}>
                                    {e.type === 'noticia' ? <Newspaper size={20} /> : e.type === 'deporte' ? <Clock size={20} /> : <Camera size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{e.type}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">•</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {e.date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}hs
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 group-hover:text-club-red transition-colors">{e.titulo || e.nombre}</h4>
                                    {e.type === 'noticia' && (
                                        <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Hacé clic para leer más →</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="p-12 text-center animate-pulse font-black uppercase tracking-widest">Cargando Agenda...</div>;

    return (
        <div className="py-12 relative">
            {/* Modal de Detalle de Noticia */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !loadingNews && setIsModalOpen(false)}>
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transition-all scale-100" onClick={e => e.stopPropagation()}>
                        {loadingNews ? (
                            <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest">Cargando Noticia...</div>
                        ) : selectedNews ? (
                            <div>
                                {/* Header del Modal */}
                                <div className="relative h-64 md:h-96 bg-black">
                                    <img 
                                        src={getImageUrl(selectedNews.imagen_url)} 
                                        className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30" 
                                        alt="" 
                                    />
                                    <img 
                                        src={getImageUrl(selectedNews.imagen_url)} 
                                        className="relative z-10 w-full h-full object-contain" 
                                        alt={selectedNews.titulo} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="absolute top-4 right-4 z-30 bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors border-2 border-white/20"
                                    >
                                        <X size={24} />
                                    </button>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <span className="bg-white text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Noticia</span>
                                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight">{selectedNews.titulo}</h2>
                                    </div>
                                </div>
                                
                                <div className="p-6 md:p-10">
                                    <p className="text-gray-400 font-bold text-sm uppercase mb-6 tracking-widest flex items-center gap-2">
                                        <CalendarIcon size={16} /> {new Date(selectedNews.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    
                                    {selectedNews.bajad && selectedNews.bajad !== "undefined" && (
                                        <p className="text-xl font-bold text-gray-600 mb-8 border-l-4 border-black pl-4 leading-relaxed italic">
                                            {selectedNews.bajad}
                                        </p>
                                    )}
                                    
                                    {selectedNews.contenido && selectedNews.contenido !== "undefined" && (
                                        <div className="prose prose-lg max-w-none text-gray-800 leading-loose whitespace-pre-line font-medium text-justify">
                                            {selectedNews.contenido}
                                        </div>
                                    )}

                                    {/* Galería Adicional */}
                                    {selectedNews.imagenes && selectedNews.imagenes.length > 0 && (
                                        <div className="mt-12">
                                            <h3 className="font-black uppercase tracking-widest text-sm mb-4">Más imágenes</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {selectedNews.imagenes.map((img, idx) => (
                                                    <div key={idx} className="aspect-video rounded-xl overflow-hidden shadow-md bg-gray-50">
                                                        <img src={getImageUrl(img)} className="w-full h-full object-contain hover:scale-110 transition-transform duration-500" alt={`Imagen ${idx + 1}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-5 gap-12 items-start">
                    <div className="md:col-span-3">
                        {renderHeader()}
                        <div className="grid grid-cols-7 mb-2">
                            {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(d => (
                                <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 py-2">{d}</div>
                            ))}
                        </div>
                        {renderDays()}
                    </div>
                    <div className="md:col-span-2">
                        <div className="sticky top-24">
                            <h3 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
                                Agenda <br /> <span className="text-gray-300">Club 9 de Julio</span>
                            </h3>
                            {renderEventDetails()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubCalendar;

