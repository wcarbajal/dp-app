import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchConToken } from "@/helpers/fetch";
import { MdEdit } from "react-icons/md";
import { DetalleProceso } from './DetalleProceso';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ListaProcesos = () => {
  const [ procesos, setProcesos ] = useState( [] );
  const [ procesoSeleccionado, setProcesoSeleccionado ] = useState( null );

  // Cargar procesos activos
  useEffect( () => {
    const cargarProcesos = async () => {
      try {
        const data = await fetchConToken( "procesos" );
        setProcesos( data.procesos || [] );
      } catch ( error ) {
        console.error( "Error al cargar procesos:", error );
      }
    };
    cargarProcesos();
  }, [] );


  return (
    <div className="flex gap-8 m-1">
      <div className="w-1/4 p-4 bg-white border rounded-lg shadow-lg">
        <h2 className="font-bold mb-2 text-center">Procesos activos</h2>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-estratégico"
        >
          { [ "Estratégico", "Misional", "Soporte" ].map( tipo => {
            const procesosPorTipo = procesos
              .filter( p => p.tipo === tipo )
              .sort( ( a, b ) => a.codigo.localeCompare( b.codigo ) );
            if ( procesosPorTipo.length === 0 ) return null;
            return (
              <AccordionItem value={ `item-${ tipo.toLowerCase() }` } key={ tipo }>
                <AccordionTrigger>
                  <span className="font-bold text-base">{ tipo }</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="max-h-96 overflow-y-auto pr-2">
                    { procesosPorTipo.map( proceso => (
                      <div
                        key={ proceso.id }
                        className={ `flex items-center justify-between text-sm border-b rounded cursor-pointer hover:bg-gray-100 ${ procesoSeleccionado?.id === proceso.id
                          ? "bg-gray-200 font-semibold border-primary"
                          : "bg-white"
                          }` }
                        onClick={ () => setProcesoSeleccionado( proceso ) }
                      >
                        <span>
                          <span className="text-xs">{ proceso.codigo }</span> - { proceso.nombre }
                        </span>
                      </div>
                    ) ) }
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          } ) }
        </Accordion>
      </div>
      <div className="flex-1 -ml-6 pt-2 pl-2 border rounded-lg shadow-lg  p-5">
        { procesoSeleccionado ? (
          
          <DetalleProceso procesoId={ procesoSeleccionado.id } />
          
        ) : (
          <div className="text-muted-foreground">Seleccione un proceso para el detalle.</div>
        ) }
      </div>
    </div>
  );
};