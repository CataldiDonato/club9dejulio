import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Users, Star, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from "../config";
import { getImageUrl } from "../utils/imageUtils";

import ClubCalendar from '../components/ClubCalendar';

const Home = () => {
  const [heroAsset, setHeroAsset] = useState('logo'); // 'logo' or 'players'
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    // Fetch birthdays
    fetch(`${API_URL}/birthdays`)
      .then((res) => res.json())
      .then((data) => setBirthdays(data))
      .catch((err) => console.error("Error fetching birthdays:", err));
      
    // Randomize on mount
    const assets = ['logo', 'players'];
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    setHeroAsset(randomAsset);
  }, []);

  return (
    <div className="flex flex-col bg-white">
      {/* Abstract Background Elements */}
      <div className="relative min-h-[700px] lg:h-[700px] bg-black text-white overflow-hidden py-12 lg:py-0">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-club-dark -skew-x-12 translate-x-1/4 opacity-50 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510051640316-543ee0fbf33c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12">
          <div className="flex-1">
            <div className="border-l-8 border-white pl-6 mb-6 lg:mb-8 mt-4 lg:mt-12">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                Pasión <br />
                <span className="text-gray-400">En Blanco</span> <br />
                Y Negro
              </h1>
            </div>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-8 lg:mb-12 font-medium tracking-wide">
              Más de 110 años escribiendo la historia de Berabevú. <br />
              <strong>El Lanudo es familia.</strong>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/socios" className="bg-white hover:bg-gray-200 text-black px-10 py-4 rounded-none font-black text-lg uppercase tracking-widest transition-transform hover:-translate-y-1 flex items-center gap-2">
                Registrate y participa del Prode
              </Link>
              <Link to="/historia" className="border-2 border-white hover:bg-white hover:text-black text-white px-10 py-4 rounded-none font-bold text-lg uppercase tracking-widest transition-colors">
                Nuestra Historia
              </Link>
            </div>
          </div>

          <div className="flex flex-1 justify-center items-center w-full max-w-sm lg:max-w-none">
            {heroAsset === 'logo' ? (
              <div className="logo-3d-container">
                <img 
                  src="/9dejulio.svg" 
                  alt="Club 9 de Julio 3D Logo" 
                  className="w-48 h-48 md:w-80 md:h-80 object-contain logo-3d-rotate drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                />
              </div>
            ) : (
              <img 
                src="/jugadores.png" 
                alt="Jugadores Club 9 de Julio" 
                className="w-full h-auto max-h-[400px] lg:max-h-[750px] scale-110 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] animate-in fade-in duration-1000"
              />
            )}
          </div>
        </div>
      </div>

      {/* Banner Campeón */}
      <div className="bg-black text-white py-6 border-y-4 border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 overflow-hidden">
          <Trophy size={24} className="text-white flex-shrink-0 md:w-10 md:h-10" />
          <span className="font-black text-lg md:text-4xl uppercase tracking-widest md:tracking-[0.2em] text-center leading-tight px-2">
            Campeón Liga Interprovincial 2023
          </span>
          <Trophy size={24} className="text-white flex-shrink-0 md:w-10 md:h-10" />
        </div>
      </div>

      {/* Sección Cumpleaños */}
      {birthdays.length > 0 && (
        <div className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">🎂</span> ¡Feliz Cumpleaños!
              </h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                Saludamos a los socios que celebran hoy
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {birthdays.map((user, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-red-500 mb-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-gray-100">
                      {user.foto_perfil ? (
                        <img 
                          src={getImageUrl(user.foto_perfil)} 
                          alt={`${user.nombre} ${user.apellido}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          <Users size={32} />
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg uppercase leading-tight text-center">
                    {user.nombre} <br /> {user.apellido}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banner Publicidad / Marca */}
      <div className="bg-white py-20 border-y border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-club-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-club-red"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Oportunidad para Negocios</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
            Tu Marca en el <br />
            <span className="text-club-red">Corazón del Lanudo</span>
          </h2>
          
          <p className="text-gray-600 font-medium text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Llegá a toda nuestra comunidad y apoyá al crecimiento del club. 
            Consultá por nuestros espacios publicitarios exclusivos.
          </p>

          <a 
            href="https://wa.me/543465659238?text=Hola!%20Me%20interesa%20sumar%20mi%20marca/negocio%20como%20sponsor%20del%20club.%20Me%20podrían%20dar%20más%20info?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-black text-white px-12 py-5 rounded-none font-black uppercase text-sm tracking-[0.3em] hover:bg-club-red transition-all hover:scale-105 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none group"
          >
            <span>Quiero ser Sponsor</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>

      <ClubCalendar />
    </div>
  );
};

export default Home;
