import React from 'react';
import { Facebook, Instagram, Phone, MapPin, Mail } from 'lucide-react';
import SponsorList from './SponsorList';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="border-b border-slate-800 bg-slate-950">
        <SponsorList location="footer" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">CLUB 9 DE JULIO</h3>
            <p className="text-sm mb-4">
              Fundado en 1913. Más de 100 años de historia, pasión y deporte en Berabevú.
              Orgullosamente "El Lanudo".
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/club9dejulioberabevu/" className="hover:text-white transition-colors"><Instagram size={24} /></a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center p-2 shadow-lg mb-4">
               <img src="/9dejulio.svg" alt="Club Logo" className="h-full w-full object-contain" />
            </div>
            <p className="text-white font-black text-center uppercase tracking-widest text-sm">9 de Julio Berabevú</p>
          </div>
          <div className="md:text-right">
            <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 md:justify-end">
                <MapPin size={20} className="mt-1 shrink-0" />
                <span className="text-sm">Rogelio Terre 802, Berabevú, Santa Fe</span>
              </li>
              <li className="flex items-center gap-3 md:justify-end">
                <Phone size={20} className="shrink-0" />
                <span className="text-sm">+54 3465 659238</span>
              </li>
              <li className="flex items-center gap-3 md:justify-end">
                <Mail size={20} className="shrink-0" />
                <span className="text-sm">club9dejulioberabevu@yahoo.com.ar</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Club Atlético 9 de Julio de Berabevú. Todos los derechos reservados.</p>
          <p>Desarrollado por <a href="https://techphite.com" className="text-white hover:text-blue-500 transition-colors" target="_blank" rel="noopener noreferrer">TechPhite.</a></p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
