
/**
 * Se encarga de calcular la suma de los productos de cada combinación posible
 * (no importa el orden)
 * @param {Array} conj Conjunto de números
 * @param {Number} lugares Cantidad de números elegida en cada combinación
 * @returns {Number} Resultado
 */
export const combinacion = ( conj, lugares ) => {
    let auxComb = [], // Índices correspondientes a una combinación
        suma = 0.,
        prod,
        j;
    if( lugares === 0 )
        return 1.;
    for( let i = 0; i < lugares; i++ )
        auxComb.push( i );
    while( auxComb[0] !== conj.length - lugares ) {
        prod = 1.
        for( let i = 0; i < lugares; i++ )
            prod *= conj[ auxComb[i] ] ;
        suma += prod;
        j = lugares - 1;
        while( j > 0 && auxComb[j] === conj.length - lugares + j )
            j--;
        if( auxComb[j] !== conj.length - lugares + j ) {
            auxComb[j]++;
            for( let i = j + 1; i < lugares; i++ )
                auxComb[i] = auxComb[j] + i - j;
        }
    }
    prod = 1.
    for( let i = 0; i < lugares; i++ )
        prod *= conj[ auxComb[i] ] ;
    suma += prod;
    return suma;
}

/**
 * Genera un polinomio a partir de sus raíces
 * @param {Array} raices 
 * @returns {Array} Coeficientes del polinomio
 */
export const generarPolinomioAPartirDeRaices = ( raices ) => {
    let coef = [],
        aux = [];
    const m = raices.length;
    for( let i = 0; i < m; i++ )
        aux.push( -raices[i] );
    for( let i = 0; i < m + 1; i++ )
        coef.push( combinacion( aux, m - i ) );
    return coef;
}

/**
 * Devuelve el resultado de p(x)
 * @param {Number} x 
 * @param {Array} coef Coeficientes del polinomio
 * @returns {Number}
 */
export const polinomio = ( x, coef ) => {
    let suma = 0.,
        potencia;
    suma = coef[0];
    for( let i = 1; i < coef.length; i++ ) {
        potencia = 1.
        for( let j = 0; j < i; j++ ) {
            potencia = potencia * x;
        }
        suma += coef[i] * potencia;
    }
    return suma;
}

/**
 * Genera el polinomio de lagrange a partir de un conjunto de puntos
 * @param {Array} x
 * @param {Array} y
 * @returns {Array}
 */
export const lagrange = ( x, y ) => {
    const n = x.length;
    let actCoef = [],
        coef = [],
        aux = [],
        ak;
    for( let i = 0; i < x.length; i++ ) {
        coef.push( 0. );
    }
    for( let k = 0; k < n; k++ ) {
        aux = structuredClone( x );
        aux.splice( k, 1 );
        actCoef = generarPolinomioAPartirDeRaices( aux );
        console.log( aux, actCoef )
        ak = polinomio( x[k], actCoef );
        for( let i = 0; i < x.length; i++ ) {
            actCoef[i] /= ak;
            actCoef[i] *= y[k];
            coef[i] += actCoef[i];
        }
    }
    return coef;
}