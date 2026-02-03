
// Import images explicitly for Vite/Webpack to process them
const club9dejulio = '/9dejulio.svg';
import alianza from '../images/clubes/Alianza.jpg';
import arteaga from '../images/clubes/Arteaga.jpg';
import belgrano from '../images/clubes/Belgrano.jpg';
import cafferata from '../images/clubes/Cafferata.jpg';
import centenario from '../images/clubes/Centenario.jpg';
import chanarense from '../images/clubes/Chanarense.jpg';
import deportivo from '../images/clubes/Deportivo.jpg';
import federacion from '../images/clubes/Federacion.jpg';
import godeken from '../images/clubes/Godeken.jpg';
import huracan from '../images/clubes/Huracan.jpg';
import independiente from '../images/clubes/Independiente.jpg';
import defensores from '../images/clubes/clubdeportivodefensores.jpg';
import union from '../images/clubes/union.jpg';

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
