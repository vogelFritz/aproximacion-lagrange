
/**
 * Arma la matriz de los coeficientes
 * @param {Array[Number]} x
 * @param {Array[Number]} y
 * @param {Number} orden Orden del polinomio que se obtiene al resolver el sistema de ec.
 * @returns {Array[Array[Number]]} Matriz de coeficientes
 */
export const armarMatrizCoeficientes = ( x, y, orden ) => {
    let matCoef = [],
        columna = [],
        cantPuntos = x.length,
        suma;
    for( let i = 0; i < orden; i++ ) {
        columna = [];
        for( let j = 0; j < orden; j++ ) {
            suma = 0.;
            for( let k = 0; k < cantPuntos; k++ )
                suma += x[k] ** (i + j);
            columna.push( suma );
        }
        matCoef.push( columna );
    }
    return matCoef;
}

/**
 * Arma el vector de términos independientes para resolver el sistema de ec.
 * @param {Array[Number]} x 
 * @param {Array[Number]} y 
 * @param {Number} orden Orden del polinomio que se obtiene al resolver el sistema de ec.
 * @returns {Array[Number]} Términos independientes
 */
export const armarTerminosIndependientes = ( x, y, orden ) => {
    let termIndep = [],
        cantPuntos = x.length,
        suma;
    for( let i = 0; i < orden; i++ ) {
        suma = 0.
        for( let k = 0; k < cantPuntos; k++ )
            suma += y[k] * x[k] ** i;
        termIndep.push( suma );
    }
    return termIndep;
}

/**
 * Agrega una columna al final
 * @param {Array[Array[Number]]} matriz 
 * @param {Array[Number]} vector 
 * @returns {Array[Array[Number]]} 
 */
export const agregarColumna = ( matriz, vector ) => {
    let auxMat = structuredClone( matriz ),
        n = matriz.length;
    for( let i = 0; i < n; i++ )
        auxMat[i].push( vector[i] );
    return auxMat;
}

/**
 * Devuelve un vector con el contenido de la columna
 * @param {Array[Array[Number]]} matriz 
 * @param {Number} columna 
 * @returns {Array[Number]}
 */
export const obtenerColumna = ( matriz, columna ) => {
    let vec = [],
        n = matriz.length;
    for( let i = 0; i < n; i++ )
        vec.push( matriz[i][columna] );
    return vec;
}

/**
 * Cambia de lugar la fila 1 con la fila 2
 * @param {Array[Array[Number]]} matriz 
 * @param {Number} fila1 
 * @param {Number} fila2 
 * @returns {Array[Array[Number]]}
 */
export const cambiarFilas = ( matriz, fila1, fila2 ) => {
    let auxMat = structuredClone( matriz ),
        vector = [];
    vector = auxMat.splice( fila1, 1, auxMat[fila2] );
    auxMat.splice( fila2, 1, vector[0] );
    return auxMat;
}

/**
 * Devuelve el valor absoluto del número
 * @param {Number} num 
 * @returns {Number}
 */
export const abs = ( num ) => ( num < 0 ) ? num * (-1) : num;

/**
 * Intercambia la fila del elemento pivote por la fila con el mayor valor absoluto abajo del elemento pivote
 * (si el elemento pivote es el mayor no cambia).
 * @param {Array[Array[Number]]} matriz 
 * @param {Number} pivote 
 * @returns {Array[Array[Number]]}
 */
export const pivoteoParcial = ( matriz, pivote ) => {
    let matAux = structuredClone( matriz ),
        max,
        elemPivote = abs( matriz[pivote][pivote] ), 
        elem,
        maxFila;
    const n = matriz.length;
    max = elemPivote;
    for( let i = pivote + 1; i < n; i++  ) {
        elem = abs( matAux[i][pivote] );
        if( max < elem ){
            max = elem;
            maxFila = i;
        }
    }
    if( max > elemPivote )
        matAux = cambiarFilas( matAux, pivote, maxFila );
    return matAux;
}

/**
 * Devuelve una matriz identidad (más el resultado en la parte ampliada).
 * @param {Array[Array[Number]]} matriz Tiene que ser la matriz ampliada para resolver un sistema de ec.
 * @returns
 */
export const gaussJordan = ( matriz ) => {
    let matAux = structuredClone( matriz ),
        n = matriz.length,
        m = matriz[1].length,
        elem;
    for( let k = 0; k < n; k++ ) {
        matAux = pivoteoParcial( matAux, k );
        elem = matAux[k][k];
        for( let j = k; j < m; j++ )
            matAux[k][j] /= elem;
        for( let i = 0; i < k; i++ ) {
            elem = matAux[i][k];
            for( let j = k; j < m; j++ )
                matAux[i][j] -= matAux[k][j] * elem;
        }
        for( let i = k + 1; i < n; i++ ) {
            elem = matAux[i][k];
            for( let j = k; j < m; j++ )
                matAux[i][j] -= matAux[k][j] * elem;
        }
    }
    return matAux;
}

/**
 * Devuelve los coeficientes obtenidos por aproximación Mínimo-Cuadrática
 * @param {Array[Number]} x 
 * @param {Array[Number]} y 
 * @param {Number} numTerminos 
 * @returns {Array[Number]}
 */
export const minimosCuadrados = ( x, y, numTerminos ) => {
    let matCoef = armarMatrizCoeficientes( x, y, numTerminos ),
        termIndep = armarTerminosIndependientes( x, y, numTerminos ),
        matAmp = agregarColumna( matCoef, termIndep );
    matAmp = gaussJordan( matAmp );

    return obtenerColumna( matAmp, matAmp.length );
}