
import img1932 from '../images/campeonatos/ano1932.gif';
import img1933 from '../images/campeonatos/Campeon 1933.jpg';
import img1963 from '../images/campeonatos/campeones 1963.gif';
import img1975 from '../images/campeonatos/campeon 1975.gif';
import img1984 from '../images/campeonatos/Campeon 1984.jpg';
import img1986 from '../images/campeonatos/campeon1986.gif';

export const championships = [
    {
        year: 1932,
        title: "El Primer Campeón de la Liga",
        image: img1932,
        photoCaption: "Santiago Galaretto, Alejandro Albizuri, José Migliore, Luis Battistini, Aldo Filotti, Laureano Guardatti, Víctor Bravo, Marcelo Camarasa, Gabino Ballesteros, Luis Ballesteros, Felipe Priotti.",
        description: "Primer Campeonato Oficial organizado por la Liga Regional de Caseros. La iniciación del mismo tuvo lugar en el mes de Abril de ese año...",
        fullText: `Primer Campeonato Oficial organizado por la Liga Regional de Caseros. Participaron 11 equipos, y se jugó a una rueda todos contra todos. Con la seguridad de Santiago Galaretto en el arco y del “Vasco” Albizuri en la defensa, la calidad de Gabino Ballesteros, Felipe Priotti, Aldo Filotti, Víctor Bravo y todo un grupo local sacrificado y de notable técnica, 9 de Julio perdió sólo un partido ante Centenario, equipo al que debía enfrentar en la final. Los de San José no se presentaron por motivos insospechados y la flamante Liga le otorgó el primer torneo de su historia a nuestro Club.`,
        stats: { pts: 16, pj: 11, gf: 25, gc: 9 },
        campaign: [
            { rival: "Union Atletic Club", result: "4 - 0", cond: "V", scorers: "" },
            { rival: "Federacion", result: "1 - 0", cond: "V", scorers: "" },
            { rival: "Belgrano (Areq)", result: "2 - 1", cond: "V", scorers: "" },
            { rival: "Chañarense", result: "3 - 2", cond: "V", scorers: "" },
            { rival: "Huracan", result: "1 - 0", cond: "L", scorers: "" },
            { rival: "Central Argentino", result: "3 - 1", cond: "V", scorers: "" },
            { rival: "Centenario", result: "3 - 3", cond: "V", scorers: "" },
            { rival: "Final vs Centenario", result: "W.O.", cond: "-", scorers: "Gana Puntos" }
        ],
        squad: [
            { number: 1, name: "Santiago Galaretto", pos: "Arquero" },
            { number: 2, name: "Alejandro Albizuri", pos: "Fullback derecho" },
            { number: 3, name: "José Migliore", pos: "Fullback izquierdo" },
            { number: 4, name: "Luis Battistini", pos: "Half derecho" },
            { number: 5, name: "Aldo Filotti", pos: "Centro half" },
            { number: 6, name: "Laureano Guardatti", pos: "Half izquierdo" },
            { number: 7, name: "Víctor Bravo", pos: "Wing derecho" },
            { number: 8, name: "Marcelo Camarasa", pos: "Inside derecho" },
            { number: 9, name: "Gabino Ballesteros", pos: "Centro foward" },
            { number: 10, name: "Luis Ballesteros", pos: "Inside izquierdo" },
            { number: 11, name: "Felipe Priotti", pos: "Wing izquierdo" }
        ]
    },
    {
        year: 1933,
        title: "El segundo también se quedó en casa",
        image: img1933,
        photoCaption: "PARADOS: Albizuri Alejandro, Batistini Luis, Galaretto Santiago, Priotti Felipe, Filotti Aldo, Guardatti Laureano. ABAJO: Bravo Victor, Camarassa Marcelo, Ballesteros Gabino, Ballesteros Luis, Cola Victorio.",
        description: "Segundo título consecutivo en dos temporadas de vida de la liga. Continuación del proceso iniciado el año anterior...",
        fullText: `Segundo título consecutivo en dos temporadas de vida de la liga. Se jugó a dos rondas con 10 equipos participantes. Logramos el campeonato con 22 puntos, 29 goles a favor y 20 en contra, ganando los dos clásicos otra vez. Esta fue la campaña que nos dio la segunda estrella.`,
        stats: { pts: 22, pj: 18, gf: 29, gc: 20 },
        campaign: [
            { rival: "Huracan", result: "1 - 2", cond: "V" },
            { rival: "Godeken", result: "2 - 0", cond: "V" },
            { rival: "IAC", result: "1 - 0", cond: "V" },
            { rival: "Corralense", result: "1 - 0", cond: "V" },
            { rival: "Chañarense", result: "2 - 2", cond: "V" },
            { rival: "Federacion", result: "1 - 3", cond: "V" },
            { rival: "Central Argentino", result: "1 - 0", cond: "V" },
            { rival: "Union", result: "6 - 2", cond: "V" },
            { rival: "Huracan", result: "1 - 1", cond: "V" },
            { rival: "Godeken", result: "5 - 3", cond: "L" },
            { rival: "IAC", result: "1 - 0", cond: "V" },
            { rival: "Corralense", result: "3 - 2", cond: "V" },
            { rival: "Chañarense", result: "3 - 4", cond: "V" },
            { rival: "Federacion", result: "0 - 1", cond: "V" },
            { rival: "Central Argentino", result: "1 - 0", cond: "V" }
        ],
        squad: [
            { name: "Albizuri Alejandro" }, { name: "Batistini Luis" }, { name: "Galaretto Santiago" },
            { name: "Priotti Felipe" }, { name: "Filotti Aldo" }, { name: "Guardatti Laureano" },
            { name: "Bravo Victor" }, { name: "Camarassa Marcelo" }, { name: "Ballesteros Gabino" },
            { name: "Ballesteros Luis" }, { name: "Cola Victorio" }
        ]
    },
    {
        year: 1935,
        title: "De las manos del gran Negro Quinteros",
        image: null,
        description: "Tercera conquista en apenas 4 temporadas disputadas. La Copa “Luis Torres” fue puesta en juego...",
        fullText: `Tercera conquista en apenas 4 temporadas. La Copa “Luis Torres” fue alcanzada con una gran actuación de Bautista Pijnan (17 goles). En la final ante Chañarense, el "Negro" Quinteros tuvo un partido brillante en el arco. Arrancamos perdiendo 1 a 0, pero lo dimos vuelta en 15 minutos para traer el título a Berabevú.`,
        stats: { pj: 22, pg: 15, pe: 2, pp: 5, gf: 64, gc: 29 },
        campaign: [
            { date: "14/04/35", rival: "Sportivo Isla Verde", result: "1 - 3", cond: "V", scorers: "Pijnan (2), Bravo" },
            { date: "18/04/35", rival: "Centenario", result: "4 - 1", cond: "L", scorers: "Bravo, Garello (2), Pijnan" },
            { date: "21/04/35", rival: "Federación", result: "6 - 2", cond: "L", scorers: "Pijnan, Garello, Niccolle (2), Bravo (2)" },
            { date: "28/04/35", rival: "Sporting", result: "3 - 0", cond: "V" },
            { date: "12/05/35", rival: "Independiente", result: "2 - 0", cond: "L", scorers: "Pijnan, Bravo" },
            { date: "19/05/35", rival: "A. Argentino", result: "3 - 1", cond: "V", scorers: "Ures, J." },
            { date: "26/05/35", rival: "Juventud Unida CA", result: "2 - 2", cond: "L", scorers: "Niccolle, Albizuri" },
            { date: "02/06/35", rival: "Huracán", result: "1 - 3", cond: "V", scorers: "Garello (2), Pijnan" },
            { date: "09/06/35", rival: "Corralense", result: "6 - 1", cond: "L" },
            { date: "16/06/35", rival: "Godeken Sport. C.", result: "0 - 3", cond: "V", scorers: "Pijnan (2), Garello" },
            { date: "23/06/35", rival: "Chañarense", result: "2 - 4", cond: "L", scorers: "Cola, Filotti" },
            { date: "11/07/35", rival: "A. Argentino", result: "4 - 1", cond: "L", scorers: "Troiani, Garello, Cola, Pijnan" },
            { date: "21/07/35", rival: "Sporting", result: "4 - 2", cond: "L", scorers: "Pijnan, Niccolle, Bravo, Troiani" },
            { date: "04/08/35", rival: "Independiente", result: "1 - 4", cond: "V", scorers: "Pijnan (2), Bravo, Troiani" },
            { date: "08/09/35", rival: "Huracán", result: "5 - 1", cond: "L", scorers: "Bravo (2), Pijnan (2), Troiani" },
            { date: "22/09/35", rival: "Godeken Spor. C.", result: "5 - 0", cond: "L", scorers: "Niccolle (2), Troiani (2), Pijnan" },
            { date: "06/10/35", rival: "Chañarense", result: "1 - 2", cond: "V", scorers: "Final" }
        ],
        squad: [
            { name: "Bravo Victor", goals: 9, pj: 20 }, { name: "Albizuri Alejandro", goals: 1, pj: 21 },
            { name: "Galaretto Hector Hugo", pj: 22 }, { name: "Filotti Aldo", goals: 1, pj: 20 },
            { name: "Cola Victorio", goals: 2, pj: 4 }, { name: "Zarco Juan Ramón", pj: 2 },
            { name: "Stival Miguel", pj: 5 }, { name: "Pagani Amo", pj: 3 },
            { name: "Sassone Aldo", pj: 9 }, { name: "Troiani Bernardino", goals: 7, pj: 10 },
            { name: "Quintero Emigdio", pj: 20, pos: "Arquero" }, { name: "Guardatti Laureano", pj: 4 },
            { name: "Ures Juan", goals: 1, pj: 15 }, { name: "Lucero Mauricio", pj: 1 },
            { name: "Sosa Pablo", pj: 19 }, { name: "Pijnan Bautista", goals: 17, pj: 22 },
            { name: "Garello Luis", goals: 8, pj: 21 }, { name: "Niccolle Armando", goals: 6, pj: 22 }
        ]
    },
    {
        year: 1963,
        title: "El Gigante regresa en su Cincuentenario",
        image: img1963,
        photoCaption: "PARADOS: Sagristani Miguel Angel, Casadei Rubén, Pinasco Mario, Bambini Rogelio, Frappa Luis, Castanetto Rubi. AGACHADOS. Cola Victor, Cola Luis M, Sassone M Angel, Protti Enzo, Martinez Roberto.",
        description: "Regreso al éxito tras 17 temporadas. El Club cumplía 50 años...",
        fullText: `Significó el regreso al éxito tras 17 temporadas. 9 de Julio cumplía sus primeros 50 años. Se destacó la fortaleza defensiva con Mario Pinasco en el arco y la garra de Sagristani, Bambini, Frappa y Valeri. En el medio Casadei, Quinteros, Pautasso y Cola abastecían a Sassone (goleador), Martínez y Protti.`,
        stats: { pj: 18, pg: 11, pe: 5, pp: 2, gf: 43, gc: 20 },
        campaign: [
            { date: "05/05/63", rival: "Chañarense", result: "1 - 1", cond: "V", scorers: "Casadei (e/c)" },
            { date: "12/05/63", rival: "Deportivo", result: "1 - 2", cond: "L", scorers: "Carubini" },
            { date: "19/05/63", rival: "Federación", result: "1 - 1", cond: "V", scorers: "Heredia" },
            { date: "26/05/63", rival: "Godeken", result: "2 - 0", cond: "L", scorers: "Sassone, Bambini" },
            { date: "02/06/63", rival: "IAC", result: "1 - 1", cond: "V", scorers: "Sassone" },
            { date: "23/06/63", rival: "Huracán", result: "1 - 3", cond: "V", scorers: "Cola, L." },
            { date: "30/06/63", rival: "Argentino", result: "4 - 2", cond: "L", scorers: "Protti (3), Martínez" },
            { date: "14/07/63", rival: "Chañarense", result: "3 - 1", cond: "L", scorers: "Cola, Sassone, Martínez" },
            { date: "21/07/63", rival: "Deportivo", result: "2 - 0", cond: "V", scorers: "Casadei, Sassone" },
            { date: "28/07/63", rival: "Federación", result: "4 - 0", cond: "L", scorers: "Sassone (2), Protti (2)" },
            { date: "04/08/63", rival: "Godeken", result: "5 - 0", cond: "V", scorers: "Casadei, Sassone (2), Protti, Martínez" },
            { date: "11/08/63", rival: "IAC", result: "4 - 2", cond: "L", scorers: "Sassone, Martínez (3)" },
            { date: "18/08/63", rival: "Huracán", result: "4 - 1", cond: "L", scorers: "Frappa, Cola, V., Protti, Martínez" },
            { date: "25/08/63", rival: "Argentino", result: "3 - 2", cond: "V", scorers: "Pautasso, Martínez (2)" },
            { date: "06/10/63", rival: "Corralense (Semi)", result: "0 - 0", cond: "L" },
            { date: "20/10/63", rival: "Corralense (Semi)", result: "2 - 0", cond: "V", scorers: "Quinteros, Cola" },
            { date: "03/11/63", rival: "Sporting (Final 1)", result: "4 - 4", cond: "N", scorers: "Cola, Sassone, Pautasso (2)" },
            { date: "10/11/63", rival: "Sporting (Final 2)", result: "1 - 0", cond: "N", scorers: "Sassone" }
        ],
        squad: [
            { number: 1, name: "Pinasco Mario", pos: "Arquero" }, { number: 2, name: "Bambini Rogelio" }, { number: 3, name: "Valeri Jose" },
            { number: 4, name: "Sagristani Miguel Angel" }, { number: 5, name: "Casadei Ruben" }, { number: 6, name: "Frappa Luis" },
            { number: 7, name: "Quinteros Adalberto" }, { number: 8, name: "Cola Luis" }, { number: 9, name: "Sassone Miguel Angel", goals: 11 },
            { number: 10, name: "Protti Enzo", goals: 7 }, { number: 11, name: "Martínez Roberto", goals: 9 }
        ]
    },
    {
        year: 1973,
        title: "La inolvidable vuelta en San José",
        image: null,
        photoCaption: "ARRIBA. DT Pinasco Omar, Pinasco Mario, Pavarini Nestor, Torres Carlos, Vitale 'pichón' Héctor, Migani Juan( Nacho), Belamatte Elvio, Uriarte Julián, Sabino Miguel (El cabo), Montot Néstor. ABAJO: Bassi Nestor, Ojeda Pablo, Cespedes Serafín, Brun Nestor , Cacchiarelli Hugo, Piatto Oreste, Mercau Alberto.",
        description: "Inicio de la Trilogía. Omar Pinasco debutando como DT...",
        fullText: `Inicio de la Trilogía. Tras 3 años de inactividad, 9 de Julio volvió y fue campeón con Omar Pinasco como DT. La final ante Centenario fue espectacular: 1-0 en la ida (Belamate) y 2-1 en San José (Cacchiarelli y Ojeda) bajo un clima hostil. Néstor Montot fue la gran figura en el arco.`,
        stats: { pj: 15, pg: 7, pe: 5, pp: 3, gf: 26, gc: 14 },
        campaign: [
            { date: "03/06/73", rival: "Godeken", result: "1 - 2", cond: "L", scorers: "Brun" },
            { date: "17/06/73", rival: "Arteaga", result: "7 - 3", cond: "L", scorers: "Vazquez, Brun (2), De Jesús (4)" },
            { date: "24/06/73", rival: "Centenario", result: "0 - 1", cond: "V" },
            { date: "01/07/73", rival: "Deportivo", result: "1 - 1", cond: "L", scorers: "Brun" },
            { date: "15/07/73", rival: "Godeken", result: "1 - 1", cond: "V", scorers: "Vitale" },
            { date: "29/07/73", rival: "Arteaga", result: "1 - 2", cond: "V", scorers: "Brun" },
            { date: "05/08/73", rival: "Centenario", result: "3 - 0", cond: "L", scorers: "Brun, Torres, Piatto" },
            { date: "12/08/73", rival: "Deportivo", result: "2 - 0", cond: "V", scorers: "Vazquez, Ojeda" },
            { date: "19/08/73", rival: "IAC (Cuartos)", result: "1 - 1", cond: "V", scorers: "Uriarte" },
            { date: "26/08/73", rival: "IAC (Cuartos)", result: "3 - 1", cond: "L", scorers: "Brun (2), Cacchiarelli" },
            { date: "16/09/73", rival: "Godeken (Semi)", result: "0 - 0", cond: "V" },
            { date: "30/09/73", rival: "Godeken (Semi)", result: "0 - 0", cond: "L" },
            { date: "07/10/73", rival: "Godeken (Desemp)", result: "3 - 1", cond: "N", scorers: "Céspedes, Cacchiarelli (2)" },
            { date: "14/10/73", rival: "Centenario (Final 1)", result: "1 - 0", cond: "L", scorers: "Belamate" },
            { date: "21/10/73", rival: "Centenario (Final 2)", result: "2 - 1", cond: "V", scorers: "Cacchiarelli, Ojeda" }
        ],
        squad: [
            { number: 1, name: "Montot Nestor", pos: "Arquero" }, { number: 2, name: "Vazquez Rodolfo" }, { number: 3, name: "Belamate Elvio", goals: 1 },
            { number: 4, name: "Savino Miguel" }, { number: 5, name: "Uriarte Julian" }, { number: 6, name: "Vitale Hector", goals: 1 },
            { number: 7, name: "Torres Juan", goals: 1 }, { number: 8, name: "Cespedes Serafin", goals: 1 }, { number: 9, name: "Brun Nestor", goals: 8 },
            { number: 10, name: "Cacchiarelli Hugo", goals: 4 }, { number: 11, name: "Piatto Oreste", goals: 1 }
        ]
    },
    {
        year: 1974,
        title: "El Bicampeonato y la final con Deportivo",
        image: null,
        description: "Bicampeonato ante el clásico rival. Un equipo que jugaba con la cabeza...",
        fullText: `Bicampeonato y la sexta estrella. La final ante Deportivo fue épica: 1-0 en la ida y un contundente 3-0 en la vuelta en casa. El equipo, liderado por el "Negro" Céspedes, Brun y Lissi, demostró una jerarquía superior, perdiendo solo 1 partido en todo el año.`,
        stats: { pj: 20, pg: 10, pe: 9, pp: 1, gf: 35, gc: 19 },
        campaign: [
            { date: "02/06/74", rival: "Deportivo", result: "1 - 1", cond: "V", scorers: "Brun" },
            { date: "09/06/74", rival: "Huracan", result: "2 - 1", cond: "L", scorers: "Alvarez (2)" },
            { date: "16/06/74", rival: "Carlos Dose", result: "2 - 1", cond: "V", scorers: "Brun, Weschta" },
            { date: "23/06/74", rival: "Godeken", result: "0 - 0", cond: "V" },
            { date: "14/07/74", rival: "Federacion", result: "3 - 1", cond: "L", scorers: "Brun (2), Cacchiarelli" },
            { date: "21/07/74", rival: "Deportivo", result: "0 - 0", cond: "L" },
            { date: "28/07/74", rival: "Huracan", result: "2 - 2", cond: "V", scorers: "Weschta, Céspedes" },
            { date: "04/08/74", rival: "Carlos Dose", result: "3 - 0", cond: "L", scorers: "Brun (2), Ojeda" },
            { date: "11/08/74", rival: "Godeken", result: "4 - 3", cond: "L", scorers: "Cacchiarelli (3), Weschta" },
            { date: "18/08/74", rival: "Federacion", result: "1 - 1", cond: "V", scorers: "Lissi" },
            { date: "08/09/74", rival: "IAC", result: "3 - 0", cond: "V", scorers: "Lissi, Céspedes, Bassi" },
            { date: "15/09/74", rival: "Huracan", result: "1 - 1", cond: "V", scorers: "Gallo" },
            { date: "29/09/74", rival: "IAC", result: "2 - 1", cond: "L", scorers: "Lissi (2)" },
            { date: "06/10/74", rival: "Huracan", result: "2 - 2", cond: "L", scorers: "Cacchiarelli, Lissi" },
            { date: "03/11/74", rival: "Chañarense (Semi)", result: "2 - 1", cond: "L", scorers: "Brun, Ojeda" },
            { date: "17/11/74", rival: "Chañarense (Semi)", result: "3 - 3", cond: "V", scorers: "Brun, Lissi, Céspedes" },
            { date: "01/12/74", rival: "Deportivo (Final 1)", result: "1 - 0", cond: "V", scorers: "Lissi" },
            { date: "08/12/74", rival: "Deportivo (Final 2)", result: "3 - 0", cond: "L", scorers: "Lissi, Céspedes, Menichelli" }
        ],
        squad: [
            { number: 1, name: "España Oscar", pos: "Arquero" }, { number: 2, name: "Caraballo Juan Carlos" }, { number: 3, name: "Casadei Walter" },
            { number: 4, name: "Uriarte Julián Jaime" }, { number: 5, name: "Weschta Jorge", goals: 3 }, { number: 6, name: "Sánchez Carlos Dalmacio", pos: "Capitán" },
            { number: 7, name: "Cacchiarelli Hugo", goals: 5 }, { number: 8, name: "Brun Néstor R.", goals: 8 }, { number: 9, name: "Lissi Raúl A.", goals: 8 },
            { number: 10, name: "Céspedes Serafín Celestino", goals: 4 }, { number: 11, name: "Gallo Adolfo", goals: 1 }
        ]
    },
    {
        year: 1975,
        title: "La Copa, la copa…se mira y no se toca!!!",
        image: img1975,
        photoCaption: "ARRIBA: DT Pinasco Omar, Corinaldessi Hugo, Uriarte Julián, España Oscar, Mercau Eduardo, Caraballo Juan Carlos, Sanchez Carlos, Gallo Adolfo, Bassi Nestor. ABAJO: Cespedes Serafín, Diaz Juan, Lissi Raúl, Gualdassi Luis, Batistelli Eduardo, Riquelme Juan A.",
        description: "Tricampeonato e Invicto. La primera Copa Challenger...",
        fullText: `Tricampeonato, Campeón Invicto, valla menos vencida y equipo más goleador. Fue el momento de mayor esplendor. Ganamos la primera Copa Challenger de la Liga. Eliminamos a Deportivo en semifinales (1-0 en el desempate) y vencimos a Independiente in la final (2-1 y 0-0). Inolvidable.`,
        stats: { pj: 19, pg: 12, pe: 7, pp: 0, gf: 37, gc: 8 },
        campaign: [
            { date: "08/06/75", rival: "Cafferatense", result: "2 - 2", cond: "V", scorers: "Lissi, Céspedes" },
            { date: "22/06/75", rival: "Deportivo", result: "2 - 1", cond: "L", scorers: "Lissi (2)" },
            { date: "06/07/75", rival: "S. Prov. San Fsco.", result: "5 - 0", cond: "V", scorers: "Brun (3), Vitale, Lissi" },
            { date: "13/07/75", rival: "J. U. Cafferatta", result: "2 - 0", cond: "L", scorers: "Céspedes, Riquelme" },
            { date: "20/07/75", rival: "Chañarense", result: "0 - 0", cond: "V" },
            { date: "27/07/75", rival: "IAC", result: "1 - 1", cond: "V", scorers: "Lissi" },
            { date: "17/08/75", rival: "Cafferatense", result: "5 - 1", cond: "L", scorers: "Gallo, Uriarte, Riquelme (3)" },
            { date: "31/08/75", rival: "Deportivo", result: "0 - 0", cond: "V" },
            { date: "07/09/75", rival: "S. Prov. San Fsco.", result: "6 - 0", cond: "L", scorers: "Caraballo, Batistelli, Vitale, Mercau, Céspedes (2)" },
            { date: "14/09/75", rival: "J.U Cafferatta", result: "2 - 0", cond: "V", scorers: "Vitale, Lissi" },
            { date: "21/09/75", rival: "Chañarense", result: "2 - 0", cond: "L", scorers: "Gallo, Brun" },
            { date: "11/12/75", rival: "IAC", result: "2 - 0", cond: "L", scorers: "Lissi, Céspedes" },
            { date: "19/10/75", rival: "Arteaga (Cuartos)", result: "2 - 1", cond: "V", scorers: "Sanchez, Caraballo" },
            { date: "26/10/75", rival: "Arteaga (Cuartos)", result: "2 - 0", cond: "L", scorers: "Caraballo, Céspedes" },
            { date: "16/11/75", rival: "Deportivo (Semi)", result: "0 - 0", cond: "L" },
            { date: "23/11/75", rival: "Deportivo (Semi)", result: "1 - 1", cond: "V", scorers: "Caraballo" },
            { date: "28/11/75", rival: "Deportivo (Desemp)", result: "1 - 0", cond: "N", scorers: "Riquelme" },
            { date: "07/12/75", rival: "Independiente (Final 1)", result: "2 - 1", cond: "V", scorers: "Lissi, Brun" },
            { date: "14/12/75", rival: "Independiente (Final 2)", result: "0 - 0", cond: "L" }
        ],
        squad: [
            { number: 1, name: "España Oscar", pos: "Arquero" }, { number: 2, name: "Bassi Néstor A." }, { number: 3, name: "Uriarte Julián J.", goals: 1 },
            { number: 4, name: "Mercau Eduardo R.", goals: 1 }, { number: 5, name: "Gallo Adolfo R.", goals: 2 }, { number: 6, name: "Sánchez Carlos D.", goals: 1 },
            { number: 7, name: "Gualdassi Luis" }, { number: 8, name: "Vitale Héctor", goals: 3 }, { number: 9, name: "Lissi Raúl A.", goals: 8 },
            { number: 10, name: "Céspedes Serafín Celestino", goals: 6 }, { number: 11, name: "Brun Néstor", goals: 5 }, { name: "Riquelme Juan A.", goals: 5 }
        ]
    },
    {
        year: 1984,
        title: "El Nene, Chicharra y los pibes del pueblo",
        image: img1984,
        photoCaption: "ARRIBA: Lissi Rubén, Hernandez Elmo, Mellado Guillermo, Bonetto Lisandro, Tonini Raúl, Cassinerio Oscar, Bonessa Adrián, Gasparini Gerardo, Videgain Miguel Angel, Córdoba Hugo. ABAJO: Rodriguez Daniel, Cacchiarelli Hugo, Fernandez Juan Carlos, Perez Ernesto, Zacnún Miguel Angel, Juncos Luis, Uriarte Julián.",
        description: "Regreso a la gloria tras 9 años. Una base local muy fuerte...",
        fullText: `Final feliz para un proceso de cambios. Con una gran base local (Pérez, Zacnún, Bonessa) y refuerzos de lujo como "Brujo" Juncos, "Nene" Cassinerio (goleador) y "Chicharra" Fernández. Aplastamos a Federación en la final: 4-0 de visitantes y 0-0 en la vuelta.`,
        stats: { pj: 22, pg: 9, pe: 7, pp: 6, gf: 38, gc: 29 },
        campaign: [
            { date: "29/04/84", rival: "Carlos Dose", result: "1 - 0", cond: "V", scorers: "Zacnún" },
            { date: "06/05/84", rival: "Centenario", result: "0 - 1", cond: "V" },
            { date: "13/05/84", rival: "Deportivo", result: "1 - 1", cond: "L", scorers: "Pérez, E." },
            { date: "20/05/84", rival: "Huracan", result: "4 - 5", cond: "L", scorers: "Cassinerio (2), Mellado, Fernández" },
            { date: "03/06/84", rival: "Arteaga", result: "0 - 3", cond: "V" },
            { date: "10/06/84", rival: "Chañarense", result: "3 - 0", cond: "L", scorers: "Cassinerio, Zacnún, Mellado" },
            { date: "24/06/84", rival: "Carlos Dose", result: "2 - 0", cond: "L", scorers: "Fernández (2)" },
            { date: "01/07/84", rival: "Centenario", result: "4 - 3", cond: "L", scorers: "Cassinerio, Cacchiarelli, Mellado, Pérez" },
            { date: "08/07/84", rival: "Deportivo", result: "2 - 2", cond: "V", scorers: "Cassinerio, Fernández" },
            { date: "15/07/84", rival: "Huracan", result: "3 - 0", cond: "V", scorers: "Cassinerio (2), Fernández" },
            { date: "22/07/84", rival: "Arteaga", result: "0 - 2", cond: "L" },
            { date: "29/07/84", rival: "Chañarense", result: "1 - 2", cond: "V", scorers: "Mellado" },
            { date: "12/08/84", rival: "FEDERACION", result: "2 - 1", cond: "V", scorers: "Videgain, Mellado" },
            { date: "19/08/84", rival: "INDEPENDIENTE", result: "1 - 3", cond: "L", scorers: "Cassinerio" },
            { date: "26/08/84", rival: "ARTEAGA", result: "2 - 2", cond: "V", scorers: "Cassinerio, Mellado" },
            { date: "02/09/84", rival: "FEDERACION", result: "0 - 0", cond: "L" },
            { date: "09/09/84", rival: "INDEPENDIENTE", result: "1 - 1", cond: "V", scorers: "Hernández" },
            { date: "16/09/84", rival: "ARTEAGA", result: "2 - 1", cond: "L", scorers: "Cassinerio, Pérez" },
            { date: "30/09/84", rival: "GODEKEN (Semi)", result: "4 - 1", cond: "L", scorers: "Tonini, Hernández, Cassinerio (2)" },
            { date: "06/10/84", rival: "GODEKEN (Semi)", result: "1 - 1", cond: "V", scorers: "Mellado" },
            { date: "28/10/84", rival: "FEDERACIÓN (Final 1)", result: "4 - 0", cond: "V", scorers: "Hernández, Cassinerio (3)" },
            { date: "03/11/84", rival: "FEDERACIÓN (Final 2)", result: "0 - 0", cond: "L" }
        ],
        squad: [
            { number: 1, name: "Juncos Alfredo Luis", pos: "Arquero" }, { number: 2, name: "Tonini Raúl", goals: 1 }, { number: 3, name: "Bonessa Adrián" },
            { number: 4, name: "Zacnún Miguel Angel", goals: 2 }, { number: 5, name: "Gasparini Gerardo" }, { number: 6, name: "Cacchiarelli Hugo", goals: 1 },
            { number: 7, name: "Hernández Elmo", goals: 3 }, { number: 8, name: "Cassinerio Oscar", goals: 15 }, { number: 9, name: "Fernández Juan Carlos", goals: 5 },
            { number: 10, name: "Pérez Ernesto", goals: 3 }, { number: 11, name: "Mellado Guillermo", goals: 7 }
        ]
    },
    {
        year: 1986,
        title: "La sana costumbre de ser campeón",
        image: img1986,
        photoCaption: "PARADOS: Sosa Indio, Fernandez Juan Carlos, Larroca Carlos, Gasparini Gerardo, Cacchiarelli Hugo, Videgain Miguel Angel, Albanessi Walter, Rola Eugenio, Mottura Darío, Gentile Walter, Córdoba Hugo. ABAJO: Pizzicotti Sergio, Hernandez Elmo, Zacnún Miguel Angel, Bonetto Lisandro, Perez Ernesto.",
        description: "Cerrando una década dorada. El talento de Pizzicotti...",
        fullText: `Prácticamente el mismo plantel de 1984, sumando a Sergio Pizzicotti (espectacular refuerzo de Rosario) y el "Polaco" Rola en el arco. Ganamos el Clausura ante Arteaga y nos quedamos con la final del año ante Centenario en un emotivo tercer partido nocturno con dos goles de Carlos "Tero" Larroca.`,
        stats: { pj: 30, pg: 14, pe: 10, pp: 6, gf: 52, gc: 49 },
        campaign: [
            { date: "02/03/86", rival: "Carlos Dose", result: "2 - 2", cond: "V", scorers: "Hernández, Fernández" },
            { date: "16/03/86", rival: "Huracan", result: "2 - 2", cond: "L", scorers: "Fernández, Pizzicotti" },
            { date: "19/03/86", rival: "Godeken", result: "3 - 2", cond: "V", scorers: "Zacnún, Fernández (2)" },
            { date: "24/03/86", rival: "Federacion", result: "1 - 3", cond: "L", scorers: "Pizzicotti" },
            { date: "27/03/86", rival: "Deportivo", result: "3 - 1", cond: "V", scorers: "Pérez (2), Pizzicotti" },
            { date: "30/03/86", rival: "Carlos Dose", result: "2 - 2", cond: "L", scorers: "Fernández (2)" },
            { date: "06/04/86", rival: "Huracan", result: "1 - 1", cond: "V", scorers: "Córdoba, J. M." },
            { date: "13/04/86", rival: "Godeken", result: "1 - 1", cond: "L", scorers: "Lorenzini" },
            { date: "20/04/86", rival: "Federación", result: "1 - 0", cond: "V", scorers: "Mottura" },
            { date: "27/04/86", rival: "Deportivo", result: "1 - 1", cond: "L", scorers: "Hernández" },
            { date: "27/07/86", rival: "Deportivo", result: "1 - 0", cond: "V", scorers: "Tonini" },
            { date: "17/08/86", rival: "Arteaga", result: "3 - 2", cond: "L", scorers: "Tonini, Hernández, Pizzicotti" },
            { date: "24/08/86", rival: "Centenario", result: "4 - 3", cond: "L", scorers: "Fernández (2), Pérez, Pizzicotti" },
            { date: "31/08/86", rival: "Alianza", result: "3 - 0", cond: "V", scorers: "Fernández, Pizzicotti (2)" },
            { date: "07/09/86", rival: "Deportivo", result: "1 - 0", cond: "L", scorers: "Pizzicotti" },
            { date: "14/09/86", rival: "Godeken", result: "2 - 1", cond: "V", scorers: "Córdoba, Pizzicotti" },
            { date: "21/09/86", rival: "Huracan (Semi Cl)", result: "2 - 1", cond: "L", scorers: "Grasso (2)" },
            { date: "28/09/86", rival: "Huracan (Semi Cl)", result: "2 - 3", cond: "V", scorers: "Fernández (2)" },
            { date: "05/10/86", rival: "Huracan (Semi Cl)", result: "1 - 1 (4-2 p)", cond: "L", scorers: "Pizzicotti" },
            { date: "12/10/86", rival: "Arteaga (Final Cl)", result: "1 - 1", cond: "V", scorers: "Fernández" },
            { date: "19/10/86", rival: "Arteaga (Final Cl)", result: "1 - 0", cond: "L", scorers: "Albanessi" },
            { date: "26/10/86", rival: "Centenario (Final 1)", result: "1 - 0", cond: "V", scorers: "Córdoba" },
            { date: "31/10/86", rival: "Centenario (Final 2)", result: "1 - 2", cond: "L", scorers: "Pérez" },
            { date: "07/11/86", rival: "Centenario (Final 3)", result: "2 - 1", cond: "N", scorers: "Larroca (2)" }
        ],
        squad: [
            { number: 1, name: "Rola Eugenio E.", pos: "Arquero" }, { number: 2, name: "Albanesi Walter H.", goals: 1 }, { number: 3, name: "Bonetto Lisandro C." },
            { number: 4, name: "Zacnún Miguel A.", goals: 1 }, { number: 5, name: "Mottura Darío M.", goals: 1 }, { number: 6, name: "Tonini Raúl J.", goals: 2 },
            { number: 7, name: "Larroca Carlos A.", goals: 2 }, { number: 8, name: "Grasso Alfredo D.", goals: 2 }, { number: 9, name: "Fernandez Juan C.", goals: 14 },
            { number: 10, name: "Pérez Laurentino E.", goals: 6 }, { number: 11, name: "Pizzicotti Sergio M.", goals: 12 }
        ]
    }
];
