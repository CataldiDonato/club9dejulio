
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
import iac from '../images/clubes/iac.jpg'; // Independiente?

// Default placeholder if needed
// const placeholder = ...

const LOGO_MAP = {
    '9 de Julio': club9dejulio,
    'Alianza': alianza,
    'Arteaga': arteaga,
    'Belgrano': belgrano,
    'Cafferatense': caferata,
    'Centenario': centenario,
    'Chañarense': chanarence,
    'Deportivo Berabevú': deportivo,
    'Federación': federacion,
    'Gödeken': godeken,
    'Huracán': huracan,
    'Independiente': iac,
    'Carlos Dose': null, // Missing? Or maybe map to one of the above if name mismatch?
};

/**
 * Returns the logo path for a given team name.
 * @param {string} teamName 
 * @returns {string|null} Image source
 */
export const getTeamLogo = (teamName) => {
    return LOGO_MAP[teamName] || null;
};
