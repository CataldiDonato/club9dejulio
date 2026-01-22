import { MapPin } from 'lucide-react';
import estadio from '../images/estadio.jpg';
import sede from '../images/sede.png';
import gimnasio from '../images/gimnasio.png';
import salon from '../images/salon.png';

const Instalaciones = () => {
  const facilities = [
    {
      title: "Estadio 'El Lanudo'",
      desc: "Nuestro campo de juego principal. Ignagurada entre los años 1938 y 1940 en terrenjos donador por ramon sorribas, uno de los funbdadores. el nombre fue elegido en homenaje a un grna deportista y presidente del club en ese momneto",
      image: estadio
    },
    {
      title: "Sede Social",
      desc: "El corazón de la vida social del club. Un espacio renovado que incluye secretaría administrativa y bar abierto a toda la comunidad. Punto de encuentro obligado para los socios.",
      image: sede
    },
    {
      title: "Complejo Natatorio",
      desc: "La pileta del pueblo, con 25 metros de largo y 3 de profundidad es concurrrida por todos en temporada de verano. el club cuenta con colonia de vacaciones para niños.",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2670&auto=format&fit=crop"
    },
    {
      title: "Gimnasio",
      desc: "Incorporado recientemente, el gimnasio es un espacio de entrenamiento y fitness para todos los miembros.",
      image: gimnasio
    },
    {
      title: "Salón",
      desc: "Multiespacio cubierto donde se practican disciplinas como Patín Artístico y danzas. Escenario también de grandes eventos sociales, fiestas, graduaciones,festivales y cenas multitudinarias.",
      image: salon
    },
    
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
                        <div className="relative group overflow-hidden shadow-2xl border-4 border-black">
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                             <img src={item.image} alt={item.title} className="w-full h-64 md:h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                        </div>
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
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Instalaciones;
