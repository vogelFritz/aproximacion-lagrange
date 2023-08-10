import { combinacion, generarPolinomioAPartirDeRaices, lagrange, polinomio } from './src/metodo-lagrange';
import { armarMatrizCoeficientes, armarTerminosIndependientes, gaussJordan, agregarColumna, obtenerColumna, minimosCuadrados } from './src/minimos-cuadrados';
import { polinomioSpline, splinesCubicos } from './src/splines-cubicos';
let grafico = document.querySelector( '.grafico' );
let x, y, coef = [], puntosX = [], puntosY = [];
let botonLagrange = document.querySelector( '#lagrange' );
let botonMinCuad = document.querySelector( '#min-cuad' );
let botonSplines = document.querySelector( '#splines' );
let formOrdenPol = document.querySelector( '.orden-pol' );
let numTerm;
grafico.style.backgroundColor = 'grey';

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 */
const agregarPunto = ( x, y ) => {
    const puntoHtml = document.createElement('div');
    puntoHtml.classList = 'punto';
    puntoHtml.style.top = `${y}px`;
    puntoHtml.style.left = `${x}px`;
    grafico.append( puntoHtml );
}

/**
 * Grafica un polinomio a partir de sus coeficientes
 * @param {Array[Number]} coef 
 * @returns {Number} Devuelve 1 al terminar
 */
const graficarPol = ( coef ) => {
    const h = 5;
    let x = 0;
	for( let i = 0; i < 300; i++ ) {
		agregarPunto( x, polinomio(x,coef) );
		x = x + h;
	}
    return 1;
}

/**
 * Grafica Splines Cúbicos midiendo la posición en pixeles.
 * @param {Array[Array[Number]]} coef 
 * @param {Array[Number]} puntosX 
 * @returns {Number} Devuelve 1 al terminar
 */
const graficarSplineCubico = ( coef, puntosX ) => {
    let x = puntosX[0], m;
    const n = puntosX.length;
    for( let i = 0; i < n - 1; i++  ) {
        m = ( puntosX[i+1] - puntosX[i] );
        for( let j = 0; j < m; j++ ) {
            agregarPunto( x, polinomioSpline( x, coef[i], puntosX[i] ) );
            x += 1;
        }
    }
    return 1;
}

grafico.addEventListener("click", (event) => {
    console.log( event.clientX, event.clientY );
    x = event.clientX;
    y = event.clientY;
    agregarPunto( x, y );
    puntosX.push(x);
    puntosY.push(y);
});

formOrdenPol.addEventListener( "submit", (event) => {
    event.preventDefault();
    const formData = new FormData( formOrdenPol )
    numTerm = formData.get( 'orden' );
} )

botonLagrange.addEventListener( "click", () => {
	coef = lagrange( puntosX, puntosY );
	graficarPol( coef );
} );
botonMinCuad.addEventListener( "click", () => {
	coef = minimosCuadrados( puntosX, puntosY, numTerm );
	graficarPol( coef );
} );

botonSplines.addEventListener( "click", () => {
    coef = splinesCubicos( puntosX, puntosY );
    graficarSplineCubico( coef, puntosX );
} )