import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';


const Noticias = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/noticias`)
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error("Error fetching news:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Últimas Novedades
        </h1>
        <div className="w-24 h-1 bg-black mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {noticias.map((item) => (
          <Link to={`/noticias/${item.id}`} key={item.id} className="group cursor-pointer block">
            <article>
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4 bg-gray-50">
                <img 
                  src={item.imagen_url ? `${API_URL}${item.imagen_url}` : "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"} 
                  alt={item.titulo} 
                  className="object-contain w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded">
                  Novedades
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500 gap-2 mb-2">
                  <Calendar size={14} />
                  <span>{new Date(item.fecha).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-black uppercase leading-tight group-hover:text-gray-700 transition-colors">
                  {item.titulo}
                </h3>
                {item.bajad && <p className="text-gray-600 line-clamp-2">{item.bajad}</p>}
                <div className="pt-2">
                  <span className="inline-flex items-center text-sm font-bold uppercase border-b-2 border-black pb-1 group-hover:border-gray-600 transition-colors">
                    Leer más <ChevronRight size={16} className="ml-1" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      
      {noticias.length === 0 && <p className="text-center text-gray-500">No hay noticias cargadas aún.</p>}


    </div>
  );
};

export default Noticias;
