import React, { useState } from 'react';
import { MapPin, Instagram, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import estadio from '../images/estadio.webp';
import sede from '../images/sede.webp';
import gimnasio from '../images/gimnasio.webp';
import salon from '../images/salon.webp';
import padel from '../images/padel.webp';
import pileta from '../images/pileta.webp';

// Import Bochas images directly
// Note: Imports with parentheses can be tricky in some bundlers, but Vite handles them usually. 
// If it fails, I might need to rename them. Let's try direct import first.
import bochas1 from '../images/bochas (1).jpeg'; 
import bochas2 from '../images/bochas (2).jpeg';
import bochas3 from '../images/bochas (3).jpeg';
import bochas4 from '../images/bochas.webp';

const FacilityCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group overflow-hidden shadow-2xl border-4 border-black h-64 md:h-[400px]">
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
      
      <img 
        src={images[currentIndex]} 
        alt={`${title} - Imagen ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-transform duration-700 grayscale group-hover:grayscale-0"
      />
      
      {/* Navigation Arrows */}
      <button 
        onClick={(e) => { e.preventDefault(); prevSlide(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); nextSlide(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

const Instalaciones = () => {
  const facilities = [
    {
      title: "Estadio Felipe Priotti",
      desc: "Nuestro campo de juego principal. Inaugurado entre los años 1938 y 1940 en terrenos donados por Ramón Sorribas, uno de los fundadores. El nombre fue elegido en homenaje a un gran deportista y presidente del club en ese momento.",
      image: estadio
    },
    {
      title: "Sede Social",
      desc: "El corazón de la vida social del club. Un espacio renovado que incluye secretaría administrativa y bar abierto a toda la comunidad. Punto de encuentro obligado para los socios.",
      image: sede
    },
    {
      title: "Canchas de Padel",
      desc: "Nuestra cancha de padel de última generación, con superficie de césped sintético, ofrecen el mejor espacio para la práctica de este deporte que crece día a día en nuestro club.",
      image: padel,
      instagram: "https://www.instagram.com/padel_club.9dejulioberabevu/"
    },
    {
      title: "Pileta",
      desc: "La pileta del pueblo, con 25 metros de largo y 3 de profundidad es concurrida por todos en temporada de verano. El club cuenta con colonia de vacaciones para niños.",
      image: pileta,
      instagram: "https://www.instagram.com/lacolodelnueve/"
    },
    {
      title: "Gimnasio",
      desc: "Incorporado recientemente, el gimnasio es un espacio de entrenamiento y fitness para todos los miembros.",
      image: gimnasio
    },
    {
      title: "Salón",
      desc: "Multiespacio cubierto donde se practican disciplinas como Patín Artístico y danzas. Escenario también de grandes eventos sociales, fiestas, graduaciones, festivales y cenas multitudinarias.",
      image: salon
    },
    {
        title: "Canchas de Bochas",
        desc: "Tradición y deporte se unen en nuestras canchas de bochas. Un espacio para la competencia y la camaradería, renovado para brindar la mejor experiencia a nuestros jugadores.",
        images: [bochas4, bochas1, bochas2, bochas3], // We use the webp first as cover
        whatsapp: "5493413052239"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero simple */}
      <div className="bg-black text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Nuestras <br/> <span className="text-gray-500">Instalaciones</span></h1>
            <p className="text-xl max-w-2xl text-gray-300">
                Conocé los espacios donde late la pasión del 9 de Julio.
            </p>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-20">
            {facilities.map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-full md:w-1/2">
                        {item.images ? (
                            <FacilityCarousel images={item.images} title={item.title} />
                        ) : (
                            <div className="relative group overflow-hidden shadow-2xl border-4 border-black">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                <img src={item.image} alt={item.title} className="w-full h-64 md:h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="text-black" />
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Instalaciones</span>
                        </div>
                        <h2 className="text-4xl font-black uppercase mb-6">{item.title}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            {item.desc}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            {item.instagram && (
                                <a href={item.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-lg">
                                    <Instagram size={20} />
                                    Seguinos
                                </a>
                            )}
                            
                            {item.whatsapp && (
                                <a href={`https://wa.me/${item.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-lg">
                                    <Phone size={20} />
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Instalaciones;
