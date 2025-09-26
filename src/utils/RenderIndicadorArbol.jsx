import { useRef, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useDrag, useDrop } from 'react-dnd';
import { Link } from 'react-router';

const ITEM_TYPE = "INDICADOR";

export function RenderIndicadorArbol( { indicador, moveIndicador } ) {

  const [ { isDragging }, dragRef ] = useDrag( {
    type: ITEM_TYPE,
    item: { id: indicador.id, tipo: indicador.tipo },
    collect: ( monitor ) => ( {
      isDragging: monitor.isDragging(),
    } ),
  } );

  const [ , dropRef ] = useDrop( {
    accept: ITEM_TYPE,
    canDrop: ( item ) => {
      // No permitir que un OEI sea hijo de otro OEI
      return !( indicador.tipo === "OEI" && item.tipo === "OEI" );
    },
    drop: ( item ) => {
      // Solo permitir el movimiento si no es OEI sobre OEI
      if (
        item.id !== indicador.id &&
        !( indicador.tipo === "OEI" && item.tipo === "OEI" )
      ) {
        moveIndicador( item.id, indicador.id );
      }
    },
  } );

  // Refs para padre e hijos
  const padreRef = useRef( null );
  const contenedorHijosRef = useRef( null );
  const hijosRefs = useRef( [] );

  // Estado para guardar las posiciones
  const [ lineas, setLineas ] = useState( [] );



  useEffect( () => {
    if ( !indicador.hijos || indicador.hijos.length === 0 ) return;

    const contenedorRect = contenedorHijosRef.current?.getBoundingClientRect();
    const padreRect = padreRef.current?.getBoundingClientRect();
    const hijosRects = hijosRefs.current.map( ref => ref?.getBoundingClientRect() );

    if ( contenedorRect && padreRect && hijosRects.every( Boolean ) ) {

      const nuevasLineas = hijosRects.map( ( hijoRect ) => ( {
        x1: hijoRect.left + hijoRect.width / 2 - contenedorRect.left,
        y1: 0,
        x2: padreRect.left + padreRect.width / 2 - contenedorRect.left,
        y2: 0,
      } ) );
      setLineas( nuevasLineas );
    }
  }, [ indicador.hijos, indicador?.hijos?.length ] );

  return (
    <div
      ref={ dropRef }
      className="flex flex-col items-center gap-5"
      key={ indicador.id }
      style={ { opacity: isDragging ? 0.5 : 1 } }
    >
      {/* Nodo padre */ }
      <div ref={ padreRef }>
        <div ref={ dragRef }>
          <Link
            to={ `/indicador/${ indicador.id }` }
            state={ { from: 'config' } }
          >
            <Card className={ `shadow w-32 border-l-4 ${ indicador.tipo === "OEI"
              ? "border-blue-500 bg-blue-50"
              : indicador.tipo === "AEI"
                ? "border-green-500 bg-green-50"
                : "border-yellow-500 bg-yellow-50"
              }` }>
              <CardHeader className="p-2 flex justify-between items-center">
                <CardTitle className="text-sm font-bold">
                  { indicador.codigo } - { indicador.nombre }
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Si hay hijos, dibuja las líneas y los hijos */ }
      { indicador.hijos && indicador.hijos.length > 0 && (
        <div className="flex flex-col items-center w-full relative gap-5">
          <div className="h-6 -m-5 w-0.5 bg-gray-400" />
          <div className="flex flex-row items-start w-full justify-center relative gap-5" ref={ contenedorHijosRef }>
            {/* SVG para las líneas */ }
            <svg
              style={ {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 40,
                pointerEvents: "none",
                zIndex: 2,
              } }
              width={ padreRef.current ? padreRef.current.offsetWidth : "100%" }
              height={ 40 }
            >
              { lineas.map( ( linea, idx ) => (
                <line
                  key={ `h-${ idx }` }
                  x1={ linea.x1 }
                  y1={ linea.y1 }
                  x2={ linea.x2 }
                  y2={ linea.y2 }
                  stroke="#a3a3a3"
                  strokeWidth="2"
                />
              ) ) }
            </svg>
            { indicador.hijos.map( ( hijo, idx ) => (
              <div
                className="flex flex-col items-center relative"
                key={ hijo.id }
                style={ { minWidth: 180 } }
                ref={ el => hijosRefs.current[ idx ] = el }
              >
                <div className="h-3 w-0.5 bg-gray-400" style={ { position: 'relative', zIndex: 1 } } />
                <RenderIndicadorArbol indicador={ hijo } moveIndicador={ moveIndicador } />
              </div>
            ) ) }
          </div>
        </div>
      ) }
    </div>
  );
}