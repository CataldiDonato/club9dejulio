
// Import images explicitly for Vite/Webpack to process them
const club9dejulio = '/9dejulio.svg';
import alianza from '../images/clubes/Alianza.webp';
import arteaga from '../images/clubes/Arteaga.webp';
import belgrano from '../images/clubes/Belgrano.webp';
import cafferata from '../images/clubes/Cafferata.webp';
import centenario from '../images/clubes/Centenario.webp';
import chanarense from '../images/clubes/Chanarense.webp';
import deportivo from '../images/clubes/Deportivo.webp';
import federacion from '../images/clubes/Federacion.webp';
import godeken from '../images/clubes/Godeken.webp';
import huracan from '../images/clubes/Huracan.webp';
import independiente from '../images/clubes/Independiente.webp';
import defensores from '../images/clubes/clubdeportivodefensores.webp';
import union from '../images/clubes/union.webp';

// Default placeholder if needed
// const placeholder = ...

const LOGO_MAP = {
    '9 de julio': club9dejulio,
    'Alianza': alianza,
    'Arteaga': arteaga,
    'Belgrano': belgrano,
    'Cafferata': cafferata,
    'Centenario': centenario,
    'Chañarense': chanarense,
    'Deportivo': deportivo,
    'Federacion': federacion,
    'Godeken': godeken,
    'Huracan': huracan,
    'Independiente': independiente,
    'Defensores de Armstrong': defensores,
    'Unión de Cruz Alta': union,
};

/**
 * Returns the logo path for a given team name.
 * @param {string} teamName 
 * @returns {string|null} Image source
 */
export const getTeamLogo = (teamName) => {
    return LOGO_MAP[teamName] || null;
};
