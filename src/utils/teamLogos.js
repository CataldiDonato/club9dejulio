
// Import images explicitly for Vite/Webpack to process them
import club9dejulio from '../images/clubes/9 de julio.jpg';
import alianza from '../images/clubes/Alianza.jpg';
import arteaga from '../images/clubes/Arteaga.jpg';
import belgrano from '../images/clubes/Belgrano.jpg';
import caferata from '../images/clubes/Caferata.jpg';
import centenario from '../images/clubes/Centenario.jpg';
import chanarence from '../images/clubes/Chanarence.jpg';
import deportivo from '../images/clubes/Deportivo.jpg';
import federacion from '../images/clubes/Federacion.jpg';
import godeken from '../images/clubes/Godeken.jpg';
import huracan from '../images/clubes/Huracan.jpg';
import independiente from '../images/clubes/Independiente.jpg';

// Default placeholder if needed
// const placeholder = ...

const LOGO_MAP = {
    '9 de julio': club9dejulio,
    'Alianza': alianza,
    'Arteaga': arteaga,
    'Belgrano': belgrano,
    'Caferata': caferata,
    'Centenario': centenario,
    'Chanarence': chanarence,
    'Deportivo': deportivo,
    'Federacion': federacion,
    'Godeken': godeken,
    'Huracan': huracan,
    'Independiente': independiente,
};

/**
 * Returns the logo path for a given team name.
 * @param {string} teamName 
 * @returns {string|null} Image source
 */
export const getTeamLogo = (teamName) => {
    return LOGO_MAP[teamName] || null;
};
