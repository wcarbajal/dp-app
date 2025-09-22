import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RenderIndicadorArbol } from '@/utils/RenderIndicadorArbol';
import { useEffect, useState } from 'react';
import indicadoresIniciales from './indicadoresIniciales';
import { NuevoIndicadorForm } from './NuevoIndicadorForm';
import { cargarMapas } from '@/helpers/mapas';
import { cargarIndicadores } from '@/helpers/indicadrores';
import { ListaMapas } from '@/components/ListaMapas';
import { IndicadorConfig } from './IndicadorConfig';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Reload } from 'tabler-icons-react';



export const IndicadoresConfig = () => {

  const [ loading, setLoading ] = useState( true );
  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );

  const [ indicadoresJSON, setIndicadoresJSON ] = useState( indicadoresIniciales );
  const [ indicadores, setIndicadores ] = useState( [] );

  
  
  useEffect( () => {
    const obtenerMapas = async () => {
      setLoading( true );
      const mapas = await cargarMapas();
      setMapas( mapas );
      setLoading( false );
    };
    obtenerMapas();
  }, [ mapaSeleccionado ] );

  const asegurarHijos = useCallback( ( nodos ) => {
    return nodos.map( nodo => ( {
      ...nodo,
      hijos: Array.isArray( nodo.hijos ) ? asegurarHijos( nodo.hijos ) : [],
    } ) );
  }, [] );


  const obtenerIndicadores = useCallback(async () => {
      if ( !mapaSeleccionado ) return;
      const { indicadores, indicadoresJSON } = await cargarIndicadores( mapaSeleccionado.id );
      setIndicadoresJSON( asegurarHijos( indicadoresJSON ) ); // <--- aquí
      setIndicadores( indicadores );
    }, [asegurarHijos, mapaSeleccionado]);

  useEffect( () => {

    obtenerIndicadores();
  }, [ obtenerIndicadores ] );


  function moveIndicador( idArrastrado, idDestino ) {
    // 1. Extraer el nodo arrastrado y quitarlo de su padre actual
    let nodoArrastrado = null;

    function extraerNodo( nodos ) {
      return nodos.filter( nodo => {
        if ( nodo.id === idArrastrado ) {
          nodoArrastrado = nodo;
          return false; // lo quitamos
        }
        if ( nodo.hijos && nodo.hijos.length > 0 ) {
          nodo.hijos = extraerNodo( nodo.hijos );
        }
        return true;
      } );
    }

    const arbolSinArrastrado = extraerNodo( [ ...indicadoresJSON ] );

    // Si no se encontró el nodo, no hacemos nada
    if ( !nodoArrastrado ) return;

    // 2. Insertar el nodo como hijo del destino
    function insertarNodo( nodos ) {
      return nodos.map( nodo => {
        if ( nodo.id === idDestino ) {
          return {
            ...nodo,
            hijos: [ ...nodo.hijos, nodoArrastrado ]
          };
        }
        if ( nodo.hijos && nodo.hijos.length > 0 ) {
          return {
            ...nodo,
            hijos: insertarNodo( nodo.hijos )
          };
        }
        return nodo;
      } );
    }

    const nuevoArbol = insertarNodo( arbolSinArrastrado );

    // 3. Actualizar el estado con el nuevo árbol
    setIndicadoresJSON( nuevoArbol );
  }
  return (

    <section className="flex flex-col min-h-[calc(100vh-5rem)] gap-1 items-center p-5   rounded-lg shadow-lg ">
      <h1 className="text-xl font-bold text-center  ">Indicadores de la entidad</h1>
      { loading
        ? ( <span className="text-center text-gray-500">Cargando...</span> )
        : (
          <>
            <ListaMapas mapas={ mapas } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />
            {
              mapaSeleccionado && (
                <div className="flex flex-col items-center gap-6 p-8 bg-gray-50 min-h-screen w-full">
                  <h2 className="text-2xl font-bold mb-6">Árbol de Indicadores</h2>

                  <Button className="fixed bottom-10 right-8 z-50 rounded-full w-14 h-14 hover:flex hover:items-center  hover:justify-between bg-black/70 hover:bg-black hover:w-46 transition-all duration-300 group overflow-hidden ">

                    <Reload strokeWidth={ 3 } size={ 50 } className="text-white h-8" />
                    <span className=" absolute left-12 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-base font-semibold whitespace-nowrap">
                      Agregar indicador
                    </span>
                  </Button>
                  <NuevoIndicadorForm mapaId={ mapaSeleccionado.id } indicadoresList={ indicadores } obtenerIndicadores={ obtenerIndicadores } />

                  <div className="w-full border border-red-600 flex flex-col p-4 rounded-lg shadow-md">
                    <div className="flex w-full border gap-5">
                      { indicadoresJSON.length === 0
                        ? <span className="text-muted-foreground text-sm">No hay indicadores registrados</span>
                        : <DndProvider backend={ HTML5Backend }>

                          {/* Aquí va tu renderizado del árbol */ }
                          { ( indicadoresJSON ).map( indicador =>
                            <RenderIndicadorArbol key={ indicador.id } indicador={ indicador } moveIndicador={ moveIndicador } />
                          ) }
                        </DndProvider>
                      }
                    </div>
                  </div>
                </div>
              )
            }
          </>
        )

      }
    </section >


  );
};

