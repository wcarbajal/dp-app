
import { ListaProcesos } from '@/components/procesos/ListaProcesos';
import { Button } from '@/components/ui/button';
import { fetchConToken } from '@/helpers/fetch';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

//import { useState } from 'react';

export const ProcesoPage = () => {

  const [ loading, setLoading ] = useState( true );
  const [ isMapa, setIsMapa ] = useState(false );
   // verificar si mapa existe
    useEffect( () => {
      const verificarMapa = async () => {
        try {
          const respuesta = await fetchConToken( "mapa" );
          console.log( "respuesta", respuesta );
  
          if ( !respuesta.ok === true ) {
            setLoading( false );
            setIsMapa( true );            
            return;
          }
           
          setLoading( false );
        } catch ( error ) {
          console.error( "Error al verificar el mapa de proceso:", error );
        }
      };
      verificarMapa();
    }, [  ] );
  


  return (

        <div className="flex flex-col gap-5 w-full justify-center items-center shadow-lg">
          <h1 className="text-xl font-bold text-center ">Procesos de la entidad</h1>
          { loading
            ? ( <div className="text-center text-gray-500">Cargando...</div> )
            : (
              ( isMapa === false )
                ? (
    
                  <ListaProcesos />
                )
                : (
                  < div className="text-center gap-5 text-gray-500 mb-5">
                    <span className="text-gray-500">No hay mapa registrado</span>
                    <br />
                    <Button variant="link">
                      <Link to="/config/mapa" className="text-blue-500">Ir a registrar Mapa</Link>
                    </Button>
                 
    
                  </div>
                )
    
            )
    
          }
        </div >

   
  );
};