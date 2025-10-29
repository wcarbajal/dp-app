export const capitalizarTexto = ( str ) => {
  if ( !str ) return "";
  return str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase();
};

export const formatearFecha = ( fecha ) => {
  if ( !fecha ) return 'Sin fecha';

  try {
    const fechaObj = new Date( fecha );
    if ( isNaN( fechaObj.getTime() ) ) return 'Fecha inválida';

    const dia = fechaObj.getDate().toString().padStart( 2, '0' );
    const mes = ( fechaObj.getMonth() + 1 ).toString().padStart( 2, '0' );
    const año = fechaObj.getFullYear();

    return `${ dia }/${ mes }/${ año }`;

  } catch ( error ) {
    console.log( error );
    return 'Fecha inválida';
  }
};