
// Import images explicitly for Vite/Webpack to process them
import club9dejulio from '../images/clubes/9dejulio.jpg';
import alianza from '../images/clubes/alianza.jpg';
import arteaga from '../images/clubes/arteaga.jpg';
import belgrano from '../images/clubes/belgrano.jpg';
import caferata from '../images/clubes/caferata.jpg';
import centenario from '../images/clubes/centenario.jpg';
import chanarence from '../images/clubes/chanarence.jpg';
import deportivo from '../images/clubes/deportivo.jpg';
import federacion from '../images/clubes/federacion.jpg';
import godeken from '../images/clubes/godeken.jpg';
import huracan from '../images/clubes/huracan.jpg';
import independiente from '../images/clubes/independiente.jpg';

// Default placeholder if needed
// const placeholder = ...

const LOGO_MAP = {
    '9dejulio': club9dejulio,
    'alianza': alianza,
    'arteaga': arteaga,
    'belgrano': belgrano,
    'caferata': caferata,
    'centenario': centenario,
    'chanarence': chanarence,
    'deportivo': deportivo,
    'federacion': federacion,
    'godeken': godeken,
    'huracan': huracan,
    'independiente': independiente,
};

/**
 * Returns the logo path for a given team name.
 * @param {string} teamName 
 * @returns {string|null} Image source
 */
export const getTeamLogo = (teamName) => {
    return LOGO_MAP[teamName] || null;
};
