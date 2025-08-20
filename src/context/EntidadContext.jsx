import { createContext, useState, useEffect } from 'react';

export const EntidadContext = createContext();

export const EntidadProvider = ( { children } ) => {

   const [ defaultEntidad, setDefaultEntidad ] = useState( null );


  // Leer de localStorage al iniciar
  useEffect( () => {
    const stored = localStorage.getItem( "defaultEntidad" );
    console.log(stored)
    if ( stored ) setDefaultEntidad( JSON.parse( stored ) );
  }, [] );

  // Guardar en localStorage cuando cambie
  useEffect( () => {
    if ( defaultEntidad !== null ) {
      localStorage.setItem( "defaultEntidad", JSON.stringify( defaultEntidad ) );
    }
  }, [ defaultEntidad ] );




  return (
    <EntidadContext.Provider value={ { defaultEntidad, setDefaultEntidad } }>
      { children }
    </EntidadContext.Provider>
  );
};
