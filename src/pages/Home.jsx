import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Users, Star, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

import ClubCalendar from '../components/ClubCalendar';

const Home = () => {
  const [heroAsset, setHeroAsset] = useState('logo'); // 'logo' or 'players'

  useEffect(() => {
    // Randomize on mount
    const assets = ['logo', 'players'];
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    setHeroAsset(randomAsset);
  }, []);

  return (
    <div className="flex flex-col bg-white">
      {/* Abstract Background Elements */}
      <div className="relative h-[700px] bg-black text-white overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-club-dark -skew-x-12 translate-x-1/4 opacity-50 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510051640316-543ee0fbf33c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex-1">
            <div className="border-l-8 border-white pl-6 mb-8 mt-12">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                Pasión <br />
                <span className="text-gray-400">En Blanco</span> <br />
                Y Negro
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-12 font-medium tracking-wide">
              Más de 110 años escribiendo la historia de Berabevú. <br />
              <strong>El Lanudo es familia.</strong>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/socios" className="bg-white hover:bg-gray-200 text-black px-10 py-4 rounded-none font-black text-lg uppercase tracking-widest transition-transform hover:-translate-y-1 flex items-center gap-2">
                Hacete Socio
              </Link>
              <Link to="/historia" className="border-2 border-white hover:bg-white hover:text-black text-white px-10 py-4 rounded-none font-bold text-lg uppercase tracking-widest transition-colors">
                Nuestra Historia
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 justify-center items-center">
            {heroAsset === 'logo' ? (
              <div className="logo-3d-container">
                <img 
                  src="/9dejulio.svg" 
                  alt="Club 9 de Julio 3D Logo" 
                  className="w-64 h-64 md:w-80 md:h-80 object-contain logo-3d-rotate drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                />
              </div>
            ) : (
              <img 
                src="/jugadores.png" 
                alt="Jugadores Club 9 de Julio" 
                className="w-full h-auto max-h-[750px] scale-110 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] animate-in fade-in duration-1000"
              />
            )}
          </div>
        </div>
      </div>

      {/* Banner Campeón */}
      <div className="bg-black text-white py-6 border-y-4 border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 overflow-hidden">
          <Trophy size={40} className="text-white flex-shrink-0" />
          <span className="font-black text-2xl md:text-4xl uppercase tracking-[0.2em] text-center whitespace-nowrap">
            Campeón Liga Interprovincial 2023
          </span>
          <Trophy size={40} className="text-white flex-shrink-0" />
        </div>
      </div>

      <ClubCalendar />
    </div>
  );
};

export default Home;
