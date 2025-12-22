import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';
import ImageViewer from '../components/ImageViewer';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/noticias/${id}`)
      .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
      })
      .then(data => {
          setNews(data);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  if (!news) return <div className="text-center py-20">Noticia no encontrada</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <ImageViewer imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />

      <Link to="/noticias" className="inline-flex items-center text-gray-500 hover:text-black mb-6 font-bold uppercase text-sm transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Volver a Noticias
      </Link>
      
      <div className="mb-8">
        <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded inline-block mb-4">
            Novedades
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase leading-none mb-4">{news.titulo}</h1>
        <div className="flex items-center text-gray-500 gap-2 font-medium">
            <Calendar size={18} />
            <span>{new Date(news.fecha).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-2xl mb-10 border border-gray-100 cursor-pointer" onClick={() => setSelectedImage(news.imagen_url ? `${API_URL}${news.imagen_url}` : null)}>
        <img 
            src={news.imagen_url ? `${API_URL}${news.imagen_url}` : "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"} 
            alt={news.titulo}
            className="w-full h-auto object-cover max-h-[500px]"
        />
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl font-medium text-gray-700 mb-8 font-sans border-l-4 border-black pl-4">
            {news.bajad}
        </p>
        <div className="whitespace-pre-line text-gray-800">
            {news.contenido}
        </div>
      </div>

      {news.imagenes && news.imagenes.length > 0 && (
        <div className="mt-12 border-t pt-12">
            <h3 className="text-2xl font-black uppercase mb-6">Galería de Fotos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.imagenes.map((img, index) => (
                    <div 
                        key={index} 
                        className="rounded-xl overflow-hidden shadow-lg h-64 border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(`${API_URL}${img}`)}
                    >
                        <img 
                            src={`${API_URL}${img}`} 
                            alt={`Galería ${index + 1}`} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
