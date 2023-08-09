import { combinacion, generarPolinomioAPartirDeRaices, lagrange, polinomio } from './src/metodo-lagrange';
let grafico = document.querySelector( '.grafico' );
let x, y, coef = [], puntosX = [], puntosY = [];
let boton = document.querySelector( '.boton' );
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
})

console.log( combinacion( [1,2,3,4], 2 ), polinomio(2,generarPolinomioAPartirDeRaices( [1,-3,-4] ) ));
coef = lagrange( [1,2,3], [1,2,3] );
console.log( coef );

boton.addEventListener( "click", (event) => {
  coef = lagrange( puntosX, puntosY );
  x = 0;
  for( let i = 0; i < 300; i++ ) {
    agregarPunto( x, polinomio(x,coef) );
    x = x + h;
  }
} )

