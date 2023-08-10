import { combinacion, generarPolinomioAPartirDeRaices, lagrange, polinomio } from './src/metodo-lagrange';
import { armarMatrizCoeficientes, armarTerminosIndependientes, gaussJordan, agregarColumna, obtenerColumna, minimosCuadrados } from './src/minimos-cuadrados';
let grafico = document.querySelector( '.grafico' );
let x, y, coef = [], puntosX = [], puntosY = [];
let botonLagrange = document.querySelector( '#lagrange' );
let botonMinCuad = document.querySelector( '#min-cuad' );
const h = 5;
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

grafico.addEventListener("click", (event) => {
    console.log( event.clientX );
    x = event.clientX;
    y = event.clientY;
    agregarPunto( x, y );
    puntosX.push(x);
    puntosY.push(y);
});

botonLagrange.addEventListener( "click", () => {
	coef = lagrange( puntosX, puntosY );
	x = 0;
	for( let i = 0; i < 300; i++ ) {
		agregarPunto( x, polinomio(x,coef) );
		x = x + h;
	}
} );
botonMinCuad.addEventListener( "click", () => {
	coef = minimosCuadrados( puntosX, puntosY, 5 );
	x = 0;
	for( let i = 0; i < 300; i++ ) {
		agregarPunto( x, polinomio(x,coef) );
		x = x + h;
	}
} );

