import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import primerEquipo from '../images/historia/primerequipo.gif';
import primerEquipoIA from '../images/historia/primerequipoIA.png';
import ano1926 from '../images/historia/ano1926.gif';
import ano1926IA from '../images/historia/ano1926IA.png';
import comision1963 from '../images/historia/comision 1963.jpg';
import comision1963IA from '../images/historia/comision 1963 IA.png';
import festejo30 from '../images/historia/Festejo30.jpg';
import festejo30IA from '../images/historia/Festejo30IA.png';
import challenger from '../images/historia/Challenguer1.jpg';
import challengerIA from '../images/historia/Challenguer1IA.png';
import regional87 from '../images/historia/regional87.jpg';
import regional87IA from '../images/historia/regional87IA.png';

const Historia = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-club-black via-gray-800 to-club-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-center">
            Nuestra Historia
          </h1>
          <p className="text-xl md:text-2xl text-center font-light">
            Más de 110 años de pasión, gloria y tradición
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Los Lanudos Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-club-blue">
            <h2 className="text-4xl font-black text-club-black mb-6 flex items-center gap-3">
              <span className="text-club-blue">🏆</span>
              LOS LANUDOS
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                El regreso a la actividad futbolística en 1953 trajo consigo el apodo con el que nuestra 
                institución es conocida en toda la zona: <strong className="text-club-blue">"LOS LANUDOS"</strong>. 
                El mismo no alude al color de camiseta, como ocurre generalmente en otros clubes, ni significa 
                que en algún momento 9 de Julio haya salido a la cancha con un pulóver Blanquinegro hecho en 
                ese material.
              </p>
              <p>
                Su verdadero origen data de 1953 y nació en la boca de nuestro nuevo archirival: Deportivo.
              </p>
              <div className="bg-blue-50 border-l-4 border-club-blue p-6 my-6">
                <p className="italic">
                  Cuenta la leyenda que ante la llegada de un nuevo clásico, el pueblo estaba alborotado. 
                  En uno de esos domingos en que Berabevú estaba paralizado por el partido entre los dos equipos 
                  locales, Deportivo logró empatar de forma agónica a 9 de Julio a segundos del final.
                </p>
                <p className="mt-4 font-bold text-club-blue text-xl text-center">
                  "¡¡¡Le cortamos La Lana a Los Lanudos!!!"
                </p>
                <p className="text-sm mt-2">
                  - Felix Martinez, jugador de Deportivo, a través de una propaladora en los festejos que 
                  duraron tres días.
                </p>
              </div>
              <p>
                Al principio los hinchas de 9 de Julio lo tomaron en forma despectiva, aunque con el correr 
                de los años se hizo mucho más simpático, al punto tal de adoptarlo como propio. Quién diría 
                que esta frase tirada al pasar un día como hoy, en pleno siglo XXI, adornaría los trapos y 
                sonaría estruendosamente en las gargantas de todos los fanáticos que siguen a la Gloriosa 
                Blanca y Negra a todas partes…
              </p>
            </div>
          </div>
        </section>

        {/* Los Primeros Pasos */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-gray-800">
            <h2 className="text-4xl font-black text-club-black mb-6">LOS PRIMEROS PASOS</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p className="text-xl font-semibold text-club-blue">
                9 de Julio de 1913. Feriado Nacional y jornada festiva en todo el país.
              </p>
              <p>
                Las calles de tierra del joven Berabevú recibiendo el sol tibio de una tarde de invierno, 
                y la juventud futbolera de la época reunida en la canchita de la hoy Escuela Primaria: ese 
                día recibían la visita de Chañarense. Los visionarios e inolvidables once jugadores que 
                integraron aquel primer equipo fueron:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-6">1º EQUIPO DE 9 DE JULIO</h3>
                <ImageCarousel
                  images={[
                    { src: primerEquipo, label: '📷 Foto Original' },
                    { src: primerEquipoIA, label: '🤖 Mejorada con IA' }
                  ]}
                  altText="Primer equipo de 9 de Julio - 1913"
                  caption="Primer equipo de 9 de Julio (1913)"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">PARADOS:</p>
                    <ul className="list-disc pl-5">
                      <li>Pablo Brog</li>
                      <li>Enrique Mancinelli</li>
                      <li>Braulio Camarassa</li>
                      <li>Gino Tombolini</li>
                      <li>Samuel Scala</li>
                      <li>Angel Negrini</li>
                      <li>Victor Dalmagro</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">SENTADOS:</p>
                    <ul className="list-disc pl-5">
                      <li>José Noguera</li>
                      <li>Eliseo Conde</li>
                      <li>Ramón Sorribas</li>
                      <li>Fermín de Gaspari</li>
                    </ul>
                  </div>
                </div>
              </div>
              <p>
                Rápidamente, después de este encuentro decidieron darle formalidad a la cuestión. Y en la 
                fecha de la Independencia Patria nació el <strong>C. A. 9 de Julio</strong>.
              </p>
              <div className="bg-blue-50 border-l-4 border-club-blue p-6 my-6">
                <h3 className="font-bold text-lg mb-2">Primera Comisión Directiva (1913)</h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <p><strong>Presidente:</strong> Fermín De Gaspari</p>
                  <p><strong>Vice:</strong> Jose Noguera</p>
                  <p><strong>Secretario:</strong> Víctor Dalmagro</p>
                  <p><strong>Pro-Secretario:</strong> Eliseo Conde</p>
                  <p><strong>Tesorero:</strong> Ramón Sorribas</p>
                  <p><strong>Pro-Tesorero:</strong> Angel Negrini</p>
                </div>
              </div>
              <p>
                Sus fundadores fueron un desprendimiento del Club Social Berabevú y resolvieron que los 
                colores de su camiseta fueran el <strong className="text-white bg-black px-2 py-1">blanco</strong> 
                {' '}y el <strong className="bg-white border border-black px-2 py-1">negro</strong> en rayas 
                verticales: blanco, que despertaba esperanza y progreso; y el negro, por la total incertidumbre 
                que generaba el proyecto.
              </p>
              <div className="mt-6">
                <ImageCarousel
                  images={[
                    { src: ano1926, label: '📷 Foto Original' },
                    { src: ano1926IA, label: '🤖 Mejorada con IA' }
                  ]}
                  altText="Equipo de 9 de Julio en 1926"
                  caption="Equipo de 1926"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Primer Torneo, Primer Campeón */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-xl p-8 border-t-4 border-yellow-500">
            <h2 className="text-4xl font-black text-club-black mb-6">
              ⭐ PRIMER TORNEO, PRIMER CAMPEÓN
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                El campeonato de <strong className="text-yellow-600">1932</strong> marcó el inicio de la 
                Liga Interprovincial, y desde el comienzo nuestro equipo se perfiló como serio candidato 
                al título. Quizás como un feliz augurio de la grandeza que conseguiría con el paso del tiempo, 
                9 de Julio se quedó con el primer torneo que se disputó.
              </p>
              <div className="flex flex-wrap gap-3 my-6">
                <span className="bg-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  🏆 1932
                </span>
                <span className="bg-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  🏆 1933
                </span>
                <span className="bg-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  🏆 1935
                </span>
              </div>
              <p className="font-semibold text-lg">
                Sólo se habían disputado 4 temporadas en nuestra Liga, y el 9 (como se lo llamaba en aquella 
                época), ya había dado 3 vueltas olímpicas.
              </p>
              <div className="mt-6">
                <ImageCarousel
                  images={[
                    { src: festejo30, label: '📷 Foto Original' },
                    { src: festejo30IA, label: '🤖 Mejorada con IA' }
                  ]}
                  altText="Festejo de campeonato en la década del 30"
                  caption="Nuestra gente festeja un nuevo título en la década del 30"
                />
              </div>
            </div>
          </div>
        </section>

        {/* El Más Gigante de Todos: Tricampeón */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-900 to-black text-white rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              👑 EL MÁS GIGANTE DE TODOS: PRIMER TRICAMPEÓN
            </h2>
            <div className="prose prose-lg max-w-none text-gray-100 space-y-4">
              <p className="text-xl">
                En la década del '70, el Club Atlético 9 de Julio escribió, tal como los Granaderos a Caballo, 
                <strong className="text-yellow-300">"su página mejor"</strong>.
              </p>
              <p>
                El Club crecía de manera constante y era una institución modelo para la región. Su agitada 
                actividad social, deportiva y cultural lo demostraban, basado en un fuerte, austero y eficaz 
                trabajo dirigencial.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 my-6">
                <h3 className="text-2xl font-bold mb-4 text-yellow-300">El Tricampeonato Histórico</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="bg-yellow-500 text-black px-8 py-4 rounded-lg text-center">
                    <div className="text-3xl font-black">1973</div>
                    <div className="text-sm">Primer Título</div>
                  </div>
                  <div className="bg-yellow-500 text-black px-8 py-4 rounded-lg text-center">
                    <div className="text-3xl font-black">1974</div>
                    <div className="text-sm">vs Deportivo</div>
                  </div>
                  <div className="bg-yellow-500 text-black px-8 py-4 rounded-lg text-center">
                    <div className="text-3xl font-black">1975</div>
                    <div className="text-sm">INVICTO ⭐</div>
                  </div>
                </div>
                <p className="mt-4 text-center text-yellow-300 font-bold text-lg">
                  Copa Challenger Dr. Ramón F. Pereyra
                </p>
                <p className="text-center text-sm">
                  Primera institución en obtener el máximo trofeo de la Liga
                </p>
              </div>
              <p>
                En 1975 conquistamos en forma invicta el tercer campeonato consecutivo y el cumplimiento 
                del sueño que todos los clubes tenían y que ninguno había logrado: 
                <strong className="text-yellow-300"> La Copa Challenger</strong>, siendo nuestra institución 
                la primera en obtenerlo.
              </p>
              <div className="mt-6">
                <ImageCarousel
                  images={[
                    { src: challenger, label: '📷 Foto Original' },
                    { src: challengerIA, label: '🤖 Mejorada con IA' }
                  ]}
                  altText="Copa Challenger Dr. Ramón F. Pereyra"
                  caption="Copa Challenger Dr. Ramón F. Pereyra"
                  maxWidth="max-w-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Década del 80 */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-club-blue">
            <h2 className="text-4xl font-black text-club-black mb-6">DÉCADA DEL '80</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Dos nuevos lauros futboleros llegarían en la década del '80:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <h3 className="font-bold text-2xl mb-2">🏆 1984</h3>
                  <p className="text-sm">
                    Una pésima actuación en el Apertura hacía imposible presagiar lo que sucedería: 
                    el equipo funcionó hasta la consagración, aportando la Octava estrella.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <h3 className="font-bold text-2xl mb-2">🏆 1986</h3>
                  <p className="text-sm">
                    La Novena estrella llegó apenas dos años después, en otra de las más recordadas 
                    celebraciones.
                  </p>
                </div>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
                <h3 className="font-bold text-lg text-red-800">29 de Octubre de 1985 - El Incendio</h3>
                <p className="text-sm">
                  Un fuego implacable destruyó casi totalmente el Salón Mayor y el Microcine. 
                  Poco tiempo después, se produjo la quiebra de la mutual, iniciando un retroceso 
                  económico que frenó aquel avance impetuoso.
                </p>
              </div>
              <div className="mt-6">
                <ImageCarousel
                  images={[
                    { src: regional87, label: '📷 Foto Original' },
                    { src: regional87IA, label: '🤖 Mejorada con IA' }
                  ]}
                  altText="Equipo del Regional 1987"
                  caption="Regional 1987 - Participación en el Torneo Regional del Consejo Federal"
                />
              </div>
            </div>
          </div>
        </section>

        {/* El Gigante Despierta */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-xl p-8 border-t-4 border-green-600">
            <h2 className="text-4xl font-black text-club-black mb-6">
              🌟 EL GIGANTE DESPIERTA NUEVAMENTE
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Los años más duros fueron entre 1995 al 2001, llegando en el 2000 al extremo de no 
                participar en el campeonato de la Liga.
              </p>
              <div className="bg-green-100 border-l-4 border-green-600 p-6 my-6">
                <h3 className="font-bold text-xl text-green-800 mb-2">Clausura 2002</h3>
                <p>
                  Tras una pésima actuación en el Apertura, ni el más fanático se hubiera atrevido a 
                  soñar con el título del Clausura. Pero lentamente, con un equipo que mezcló experiencia 
                  con juventud local, renació aquella garra y hambre de gloria que parecían olvidados.
                </p>
                <p className="font-semibold mt-2">
                  12 de Enero de 2003: Vuelta olímpica en territorio de Chañarense después de 11 años.
                </p>
              </div>
              <p>
                El nuevo regreso de la Fiesta Provincial del Maíz en 2004, la reedición del Baile del Vino, 
                los eventos culturales, la remodelación del salón mayor, la gran fiesta del 90º Aniversario, 
                son producto del arrojo de gente nueva junto a gente de experiencia que anhela ubicar al 
                club en la posición de la que nunca debió salir.
              </p>
            </div>
          </div>
        </section>

        {/* Palmarés Completo */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-club-black to-gray-800 text-white rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl font-black mb-8 text-center">🏆 PALMARÉS HISTÓRICO</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {[1932, 1933, 1935, 1963, 1973, 1974, 1975, 1984, 1986, 2011, 2016, 2018, 2023].map((year, index) => (
                <div 
                  key={year} 
                  className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-black text-xl shadow-lg transform hover:scale-110 transition-transform"
                >
                  🏆 {year}
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-xl font-semibold">
              13 CAMPEONATOS DE PRIMERA DIVISIÓN
            </p>
            <p className="text-center text-yellow-300 text-sm mt-2">
              Incluye el histórico Tricampeonato '73-'74-'75 y la Copa Challenger
            </p>
          </div>
        </section>

        {/* Comisión Directiva 1963 */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-yellow-500">
            <h2 className="text-4xl font-black text-club-black mb-6">CAMPEONATO 1963 - 50 AÑOS DEL CLUB</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Con mayoría de jugadores de la localidad, no solo se pegó el grito en la primera división, 
                sino que fue acompañado por el título de Reserva. Un festejo a lo Grande, coincidiendo con 
                los primeros 50 años de vida de un Club con espíritu de Campeón.
              </p>
              <div className="mt-6">
                <ImageCarousel
                  images={[
                    { src: comision1963, label: '📷 Foto Original' },
                    { src: comision1963IA, label: '🤖 Mejorada con IA' }
                  ]}
                  altText="Comisión Directiva año 1963"
                  caption="Comisión Directiva año 1963"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Época Reciente */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-4xl font-black text-club-black mb-8">ÉPOCA RECIENTE</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">2023 - CAMPEÓN ABSOLUTO 🏆</h3>
                <p className="text-gray-700">
                  Año histórico bajo la dirección de Gasparini. El club se consagró Campeón Anual Absoluto 
                  ganando Apertura y Clausura. Final vs Huracán (Los Quirquinchos): 3-0 global.
                </p>
              </div>
              <div className="border-l-4 border-gray-400 pl-6">
                <h3 className="text-2xl font-bold text-gray-600 mb-2">2024 - Subcampeón 🥈</h3>
                <p className="text-gray-700">
                  Protagonista llegando a la final anual. Empate en el global contra Centenario, 
                  definición por penales. Dignísimo subcampeonato tras temporada brillante.
                </p>
              </div>
              <div className="border-l-4 border-club-blue pl-6">
                <h3 className="text-2xl font-bold text-club-blue mb-2">2025 - Actualidad ⚽</h3>
                <p className="text-gray-700">
                  El club sigue siendo gran animador de torneos superiores. Inferiores (Séptima División) 
                  con campeonatos Apertura/Clausura, asegurando el semillero del club.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Galería de Presidentes */}
        <section className="mb-16">
          <div className="bg-gray-50 rounded-xl shadow-xl p-8 border-t-4 border-gray-700">
            <h2 className="text-4xl font-black text-club-black mb-8 text-center">
              GALERÍA DE PRESIDENTES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Fermín Gaspari</p>
                <p className="text-gray-600">1913</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Santiago Galaretto</p>
                <p className="text-gray-600">1928/29</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Bernardino Priotti</p>
                <p className="text-gray-600">1930/32</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Justo Torres</p>
                <p className="text-gray-600">1933/36, 1940/41</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Eduardo Sorribas</p>
                <p className="text-gray-600">1937/39</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Ismael Sorribas</p>
                <p className="text-gray-600">1942/45</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Ramón Eixarch</p>
                <p className="text-gray-600">1946/47</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Felipe Priotti</p>
                <p className="text-gray-600">1948/51</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">José R Castro</p>
                <p className="text-gray-600">1952/53</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Rogelio Camarasa</p>
                <p className="text-gray-600">1954/55</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Raúl Carelli</p>
                <p className="text-gray-600">1956/59</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Daniel Sorribas</p>
                <p className="text-gray-600">1960/61</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Victorio Cola</p>
                <p className="text-gray-600">1962/63</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Juan Mazzoni</p>
                <p className="text-gray-600">1964/67</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Luis Jorge Priotti</p>
                <p className="text-gray-600">1967/68</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Emilio Bonetto</p>
                <p className="text-gray-600">1968/69</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Luis María Cola</p>
                <p className="text-gray-600">1969/77</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Plinio Comesaña</p>
                <p className="text-gray-600">1977/82</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Mario Sciacqua</p>
                <p className="text-gray-600">1982/83, 1987/89</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Francisco Hadad</p>
                <p className="text-gray-600">1983/87</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Ademar Carlos Priotti</p>
                <p className="text-gray-600">1989/91</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Enzo Trombetti</p>
                <p className="text-gray-600">1991/2011</p>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <p className="font-bold">Carlos René Montot</p>
                <p className="text-gray-600">2011/2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mensaje Final */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-club-blue to-blue-600 text-white rounded-xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              ¡Salud 9 de Julio!
            </h2>
            <p className="text-xl md:text-2xl font-semibold">
              Naciste grande y grande por siempre serás
            </p>
            <p className="text-lg mt-4 opacity-90">
              1913 - 9 de Julio - {new Date().getFullYear()}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Historia;
