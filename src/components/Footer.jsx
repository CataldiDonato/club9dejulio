import React from 'react';
import { Facebook, Instagram, Phone, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">CLUB 9 DE JULIO</h3>
            <p className="text-sm mb-4">
              Fundado en 1913. Más de 100 años de historia, pasión y deporte en Berabevú.
              Orgullosamente "El Lanudo".
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={24} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={24} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-1" />
                <span className="text-sm">Berabevú, Santa Fe, Argentina.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} />
                <span className="text-sm">+54 3465 123456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} />
                <span className="text-sm">contacto@9dejulioberabevu.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><button className="text-sm hover:text-white transition-colors">Házte Socio</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Alquiler de Salón</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Mutual</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Tienda Oficial</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Club Atlético 9 de Julio de Berabevú. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
