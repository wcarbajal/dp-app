
import { ListaMapas } from '@/components/ListaMapas';
import { ListaProcesos } from '@/components/procesos/ListaProcesos';


import { cargarMapas } from '@/helpers/mapas';
import { cargarProcesos } from '@/helpers/procesos';
import { useEffect, useState } from 'react';


//import { useState } from 'react';

export const ProcesoPage = () => {

  const [ loading, setLoading ] = useState( true );
  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );
  const [ procesosSeleccionado, setProcesosSeleccionado ] = useState( null );

  useEffect( () => {
    const obtenerMapas = async () => {
      setLoading( true );
      const mapas = await cargarMapas();
      setMapas( mapas );
      setLoading( false );
    };
    obtenerMapas();
  }, [ mapaSeleccionado ] );

  useEffect( () => {
    const obtenerProcesos = async () => {
      if ( !mapaSeleccionado ) return;
      const procesos = await cargarProcesos( mapaSeleccionado.id );
      setProcesosSeleccionado( procesos );
    };
    obtenerProcesos();
  }, [ mapaSeleccionado ] );



  return (

    <section className="flex flex-col min-h-screen gap-1 w-full  items-center shadow-lg ">
      <h1 className="text-xl font-bold text-center  ">Procesos de la entidad</h1>
      { loading
        ? ( <span className="text-center text-gray-500">Cargando...</span> )
        : (
          <>
            <ListaMapas mapas={ mapas } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />
            <ListaProcesos procesos={ procesosSeleccionado || [] }/>
          </>
        )

      }
    </section >


  );
};