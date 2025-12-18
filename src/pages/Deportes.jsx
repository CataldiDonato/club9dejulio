import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Info } from 'lucide-react';
import { API_URL } from '../config';

const Deportes = () => {
  const [deportes, setDeportes] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/deportes`)
      .then(res => res.json())
      .then(data => setDeportes(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Nuestras Disciplinas
        </h1>
        <div className="w-24 h-1 bg-black mx-auto"></div>
      </div>

      {deportes.length === 0 ? (
          <p className="text-center text-gray-500">No hay deportes cargados aún.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deportes.map((sport) => (
            <div key={sport.id} className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[3/4] cursor-pointer" onClick={() => setSelectedSport(sport)}>
                <img 
                src={sport.imagen_url || "https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"} 
                alt={sport.nombre} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-black text-white uppercase italic mb-2 tracking-wide">{sport.nombre}</h3>
                <p className="text-gray-300 text-sm font-bold uppercase flex items-center gap-2">
                    <Info size={16} /> Más Info
                </p>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* MODAL */}
      {selectedSport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedSport(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => setSelectedSport(null)}
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
                
                <div className="h-64 overflow-hidden relative">
                    <img 
                        src={selectedSport.imagen_url || "https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"}
                        className="w-full h-full object-cover" 
                        alt={selectedSport.nombre}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                        <h2 className="text-4xl font-black text-white uppercase italic">{selectedSport.nombre}</h2>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <Calendar className="text-black shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold uppercase text-sm text-gray-500 mb-1">Días y Horarios</h4>
                                <p className="font-bold text-gray-900">{selectedSport.dia_horario || 'A confirmar'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <User className="text-black shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold uppercase text-sm text-gray-500 mb-1">Profesor / Encargado</h4>
                                <p className="font-bold text-gray-900">{selectedSport.profesor || 'Staff del Club'}</p>
                            </div>
                        </div>
                    </div>

                    <h4 className="font-bold uppercase text-gray-900 mb-2">Descripción</h4>
                    <p className="text-gray-600 leading-relaxed">
                        {selectedSport.descripcion || 'Vení a disfrutar de este deporte en nuestras instalaciones. Consultá en secretaría para inscribirte.'}
                    </p>

                    <div className="mt-8 pt-6 border-t flex justify-end">
                        <button onClick={() => setSelectedSport(null)} className="px-6 py-2 bg-gray-100 font-bold hover:bg-gray-200 rounded-lg transition-colors text-sm uppercase">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
export default Deportes;
