import React from 'react';

const Historia = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-club-dark mb-8 border-b-4 border-club-blue inline-block">Nuestra Historia</h1>
      
      <div className="prose prose-lg prose-slate max-w-none">
        
        {/* Intro */}
        <p className="lead text-xl text-slate-600 mb-8">
          Fundado en 1913, el <strong>Club Atlético 9 de Julio</strong> de Berabevú es una institución emblemática con más de 110 años de pasión, deporte y gloria en la Liga Interprovincial de Fútbol.
        </p>

        {/* Ficha del Club */}
        <div className="bg-slate-50 border-l-4 border-club-blue p-6 mb-12 shadow-sm">
            <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                FICHA DEL CLUB "EL LANUDO"
            </h3>
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
                <p><span className="font-bold text-gray-900">Nombre Completo:</span> Club Atlético 9 de Julio</p>
                <p><span className="font-bold text-gray-900">Localidad:</span> Berabevú, Santa Fe</p>
                <p><span className="font-bold text-gray-900">Apodo:</span> "El Lanudo"</p>
                <p><span className="font-bold text-gray-900">Fundación:</span> 1913 (110+ años)</p>
                <p><span className="font-bold text-gray-900">Liga:</span> Liga Interprovincial de Fútbol Dr. Ramón Pereyra (LIF)</p>
                <p><span className="font-bold text-gray-900">Clásicos:</span> Centenario (S.J. de la Esquina), Huracán (Los Quirquinchos)</p>
            </div>
        </div>

        {/* Palmares */}
        <div className="mb-12">
             <h3 className="text-2xl font-bold text-black mb-6">Palmarés Histórico (13 Títulos)</h3>
             <p className="mb-4 text-gray-700">9 de Julio es uno de los clubes más ganadores y tradicionales de la liga. Miembro fundador "de facto" al ganar el primer torneo de la historia en 1932.</p>
             <div className="flex flex-wrap gap-2">
                {[1932, 1933, 1935, 1963, 1973, 1974, 1975, 1984, 1986, 2011, 2016, 2018, 2023].map(year => (
                    <span key={year} className="bg-club-blue text-black px-3 py-1 rounded-full font-bold text-sm shadow-sm border border-blue-600">
                        {year}
                    </span>
                ))}
             </div>
             <p className="mt-4 text-sm text-gray-500 italic">* Incluye el histórico Tricampeonato '73-'74-'75 y el Campeonato Anual Absoluto 2023.</p>
        </div>

        {/* Timeline / Recent History */}
        <h3 className="text-2xl font-bold text-black mb-6">Desempeño Reciente y Época Dorada</h3>
        <div className="my-8 border-l-4 border-gray-900 pl-12 space-y-10">
            <div className="relative">
                <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 ring-4 ring-white"></span>
                <h4 className="text-xl font-black text-black">2023 - El Año del "Lanudo" (Campeón Absoluto)</h4>
                <div className="text-gray-700 mt-2 space-y-2">
                    <p>Un año histórico bajo la dirección técnica de Gasparini. El club se consagró <strong>Campeón Anual Absoluto</strong> ganando tanto el Torneo Apertura como el Clausura, sin necesidad de finalísima.</p>
                    <ul className="list-disc pl-5">
                        <li><strong>Final Clausura:</strong> Venció a Huracán de Los Quirquinchos (Global 3-0: 1-0 ida, 2-0 vuelta en Berabevú).</li>
                    </ul>
                </div>
            </div>

            <div className="relative">
                <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 ring-4 ring-white"></span>
                <h4 className="text-xl font-black text-black">2024 - Subcampeón de la Liga</h4>
                <p className="text-gray-700 mt-2">
                    Protagonista absoluto llegando nuevamente a la final anual. Tras empatar en el global contra Centenario (San José de la Esquina), la definición por penales dejó a 9 de Julio con un dignísimo subcampeonato tras una temporada brillante.
                </p>
            </div>

            <div className="relative">
                <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 ring-4 ring-white"></span>
                <h4 className="text-xl font-black text-black">2025 - Actualidad</h4>
                <p className="text-gray-700 mt-2">
                    El club sigue siendo el gran animador de los torneos superiores. En inferiores (Séptima División), ya se han registrado festejos de campeonatos en los torneos Apertura/Clausura, asegurando el semillero del club.
                </p>
            </div>
        </div>

        {/* Liga Info */}
        <div className="bg-gray-100 p-6 rounded-lg mt-12">
             <h4 className="font-bold text-lg mb-2 text-black">Sobre la Liga</h4>
             <p className="text-gray-700 text-sm">
                 La <strong>Liga Interprovincial de Fútbol Dr. Ramón Pereyra</strong> tiene su sede en Chañar Ladeado. 9 de Julio es un pilar fundamental de su historia, habiendo ganado el torneo inaugural en el año 1932.
             </p>
        </div>

      </div>
    </div>
  );
};

export default Historia;
