import React from 'react';
import { ArrowRight, Trophy, Users, Star, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

import ClubCalendar from '../components/ClubCalendar';

const Home = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* ... Hero Section ... */}
      <div className="relative h-[700px] bg-black text-white overflow-hidden">
        {/* ... Hero Content ... */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-club-dark -skew-x-12 translate-x-1/4 opacity-50 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510051640316-543ee0fbf33c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
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



      {/* Gallery Grid */}
      <div className="py-24 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                        <Camera size={36} /> Galería
                    </h2>
                    <p className="text-gray-400">Momentos que nos definen.</p>
                </div>
                <button className="hidden md:block bg-white text-black px-6 py-2 font-bold uppercase text-sm hover:bg-gray-200 transition-colors">Ver Todo</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                {/* Note: Using placeholders since we don't have real assets */}
                <div className="col-span-2 row-span-2 relative group overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase">Fútbol</span>
                        <h3 className="text-2xl font-bold mt-2">Una gran pasión</h3>
                    </div>
                </div>
                <div className="col-span-1 row-span-1 relative group overflow-hidden bg-gray-800">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543351611-58f6a2ff8578?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"></div>
                     <div className="absolute bottom-0 left-0 p-4">
                        <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase">Hinchada</span>
                    </div>
                </div>
                <div className="col-span-1 row-span-1 relative group overflow-hidden bg-gray-800">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase">Padel</span>
                    </div>
                </div>
                <div className="col-span-2 row-span-1 relative group overflow-hidden bg-gray-800">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510051640316-543ee0fbf33c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"></div>
                     <div className="absolute bottom-0 left-0 p-6">
                        <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase">Bochas</span>
              
                    </div>
                </div>
            </div>
            
             <button className="w-full md:hidden mt-4 bg-white text-black px-6 py-3 font-bold uppercase text-sm hover:bg-gray-200 transition-colors">Ver Todo</button>
          </div>
      </div>
    </div>
  );
};

export default Home;
