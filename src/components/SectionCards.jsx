import { Ejemplo } from './graficos/Ejemplo';
import React, { useEffect, useState } from 'react';
import { cargarMapas, cargarDataChart } from '@/helpers/mapas';

import { ListaMapas } from './ListaMapas';
import { DetalleError } from './DetalleError';
import { BarChartVertical } from './graficos/BarChartVertical';

export const DashboardCards = () => {

  const [ loading, setLoading ] = useState( true );
  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );
  const [ dataChart, setDataChart ] = useState( null );

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
    const obtenerDatos = async () => {
      if ( !mapaSeleccionado ) return;

      const resDataChart = await cargarDataChart( mapaSeleccionado.id );
      console.log( "resDataChart", resDataChart );

      setDataChart( resDataChart );

    };
    obtenerDatos();
  }, [ mapaSeleccionado ] );



  return (
    <article className="flex flex-col min-h-[calc(100vh-200px)] gap-1 w-full  items-center ">
      <h1 className="text-xl font-bold text-center  ">Gráficos</h1>
      { loading
        ? ( <span className="text-center text-gray-500">Cargando...</span> )
        : (
          <>
            <ListaMapas mapas={ mapas } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />
            {
              mapaSeleccionado && (
                <section className="grid grid-cols-1  lg:grid-cols-2 gap-4 w-full p-2">
                  <DetalleError>
                    <BarChartVertical
                      titulo="Procesos por nivel"
                      subtitulo="Cantidad de procesos por nivel"
                      data={ dataChart?.porNivel }
                      variables={ [ "nivel", "cantidad" ] }
                    />
                  </DetalleError>

                  <DetalleError>
                    <Ejemplo
                      titulo="Procesos por tipo"
                      subtitulo="Cantidad de procesos por tipo"
                      data={ dataChart?.porTipo }
                      variables={ [ "tipo", "cantidad" ] }
                    />
                  </DetalleError>

                </section>
              )
            }
          </>
        )

      }
    </article >
  );
}




