import { agregarColumna } from "./minimos-cuadrados";

/**
 * Arma el vector h a partir de x
 * @param {Array[Number]} x
 * @returns {Array[Number]} 
 */
const armarH = ( x ) => {
    let h = [],
        n = x.length;
    for( let i = 0; i < n - 1; i++ )
        h.push( x[i + 1] - x[i] );
    return h;
}

/**
 * @param {Number} x
 * @param {Array[Number]} coef 
 * @param {Number} xj 
 */
export const polinomioSpline = ( x, coef, xj ) => {
    let suma = 0., aux,
        potencia;
    suma = coef[0];
    aux = x - xj;
    for( let i = 1; i < coef.length; i++ ) {
        potencia = 1.;
        for( let j = 0; j < i; j++ ) {
            potencia = potencia * aux;
        }
        suma += coef[i] * potencia;
    }
    return suma;
}

/**
 * Devuelve las tres diagonales de los coeficientes de los Splines Cúbicos
 * para resolver el sistema usando el método de Thomas
 * @param {Array[Number]} h
 * @param {Array[Number]} u
 * @param {Array[Number]} d
 * @param {Array[Number]} l
 * @returns {Number} Devuelve 1 al terminar
 */
export const armarCoefSplines = ( h, u, d, l ) => {
    const n = h.length;
    l.push( 0. );
    d.push( 1. );
    u.push( 0. );
    for( let i = 1; i < n; i++ ) {
        l.push( h[i - 1] );
        d.push( 2 * (h[i - 1] + h[i]) );
        u.push( h[i] );
    }
    l.push( 0. );
    d.push( 1. );
    u.push( 0. );

    return 1;
}

/**
 * 
 * @param {Array[Number]} h 
 * @param {Array[Number]} f 
 * @returns {Array[Number]}
 */
export const armarTermIndepSplines = ( h, f ) => {
    let b = [],
        n = f.length;
    b.push( 0. );
    for( let i = 1; i < n - 1; i++ )
        b.push( 3. * ( f[i+1] - f[i] ) / h[i] - 3 * ( f[i] - f[i-1] ) / h[i-1] );
    b.push( 0. );
    return b;
}

/**
 * Devuelve la solución del sistema de ecuaciones (tri-diagonal)
 * @param {Array[Number]} u 
 * @param {Array[Number]} d 
 * @param {Array[Number]} l 
 * @param {Array[Number]} b 
 * @returns {Array[Number]}
 */
const thomas = ( u, d, l, b ) => {
    let u2 = structuredClone( u ),
        d2 = structuredClone( d ),
        l2 = structuredClone( l ),
        b2 = structuredClone( b ),
        elem,
        n = b.length;
    for( let i = 0; i < n - 1; i++ ) {
        elem = d2[i];
        d2[i] = 1.;
        u2[i] /= elem;
        b2[i] /= elem;
    
        elem = l2[i+1];
        l2[i+1] = 0.;
        d2[i+1] -= u2[i] * elem;
        b2[i+1] -= b2[i] * elem;
    }
    b2[n] /= d2[n];
    d2[n] = 1.
    for( let i = 0; i < n - 1; i++ ) {
        b2[i] -= u2[i];
    }
    return b2;
}

/**
 * Devuelve un arreglo con los coeficientes de cada polinomio obtenido
 * @param {Array[Number]} x 
 * @param {Array[Number]} f 
 * @returns {Array[Array[Number]]}
 */
export const splinesCubicos = ( x, f ) => {
    let h = armarH( x ), n,
        u = [], d = [], l = [],
        b = [], bCoef = [], dCoef = [],
        c = [],
        coef = [];
    b = armarTermIndepSplines( h, f );
    armarCoefSplines( h, u, d, l );
    c = thomas( u, d, l, b );

    console.log({ f, c, h });
    n = h.length;
    for( let i = 0; i < n; i++ ) {
        bCoef.push( ( f[i+1] - f[i] ) / h[i] - h[i] * ( 2 * c[i] + c[i+1] ) / 3. );
        dCoef.push( ( c[i+1] - c[i] ) / ( 3. * h[i] ) );
    }
    for( let i = 0; i < n; i++ )
        coef.push( [] );
    coef = agregarColumna( coef, f );
    coef = agregarColumna( coef, bCoef );
    coef = agregarColumna( coef, c );
    coef = agregarColumna( coef, dCoef );
    return coef;
}

