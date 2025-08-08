import { useEffect, useState } from "react";

import { FlechaSubir } from '@/components/propios/FlechaSubir';
import { ListaMapas } from '@/components/ListaMapas';
import { MapaVista } from '@/components/mapa/MapaVista';

import { cargarMapas } from "@/helpers/mapas";
import { cargarProcesos } from "@/helpers/procesos";


export const MapaPage = () => {

  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );
  const [ procesosSeleccionado, setProcesosSeleccionado ] = useState( null );
  const [ loading, setLoading ] = useState( true );


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

  /*   const handleMapaSeleccionado = ( value ) => {
      const mapa = mapas.find( m => m.id === Number( value ) );
      setMapaSeleccionado( mapa );
    }; */


  return (
    <div className="flex flex-col w-full justify-center items-center shadow-lg">
      <h1 className="mt-2 text-xl font-bold text-center ">Mapa de Procesos</h1>
      { loading
        ? ( <div className="text-center text-gray-500">Cargando...</div> )
        : (
          <div>

            { mapas && mapas.length > 0 ? (
              <div className="flex flex-col ">


                <ListaMapas mapas={ mapas } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />

                { mapaSeleccionado && (
                  <div className="flex flex-col  bg-red-100 rounded-lg w-full h-full">
                    <h2 className="text-center text-lg font-semibold">
                      { mapaSeleccionado ? mapaSeleccionado.nombre : '-' }
                    </h2>
                    <MapaVista
                      entrada={ mapaSeleccionado ? mapaSeleccionado.entrada : '' }
                      salida={ mapaSeleccionado ? mapaSeleccionado.salida : '' }
                      estrategicos={ procesosSeleccionado ? procesosSeleccionado.filter( p => p.tipo === "Estratégico" ) : [] }
                      misionales={ procesosSeleccionado ? procesosSeleccionado.filter( p => p.tipo === "Misional" ) : [] }
                      soporte={ procesosSeleccionado ? procesosSeleccionado.filter( p => p.tipo === "Soporte" ) : [] }
                    />

                  </div>
                )

                }   


              </div>
            )
              : (
                <div className="text-red-500">No hay mapas disponibles</div>
              )
            }


          </div>

        )

      }
      <FlechaSubir />

    </div >
  );
};