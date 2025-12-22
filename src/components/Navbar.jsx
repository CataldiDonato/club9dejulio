import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, User } from 'lucide-react';

import logo from '../images/logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Historia', path: '/historia' },
    { name: 'Instalaciones', path: '/instalaciones' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Deportes', path: '/deportes' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Prode', path: '/prode/jugar' },
    { name: 'Ranking', path: '/prode/ranking' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-club-black text-white shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img src={logo} alt="Club Logo" className="h-12 w-12 object-contain rounded-full bg-white/10 p-1" />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight uppercase">Club 9 de Julio</span>
                <span className="text-xs font-bold text-gray-400 tracking-widest">BERABEVÚ</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors ${
                    isActive(link.path)
                      ? 'bg-white text-club-black'
                      : 'text-gray-300 hover:bg-club-gray hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/socios"
                className="bg-white text-club-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-colors ml-4"
              >
                <User size={18} />
                Portal Socios
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-club-gray focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-club-black pb-4 border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-bold uppercase ${
                  isActive(link.path)
                    ? 'bg-white text-club-black'
                    : 'text-gray-300 hover:bg-club-gray hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/socios"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-bold bg-white text-club-black mt-4 uppercase"
            >
              Portal Socios
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
