import { useState } from "react";
import { Button } from "@/components/ui/button";

import { MdEdit } from "react-icons/md";
import { DetalleProceso } from './DetalleProceso';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from 'react-router';


export const ListaProcesos = ( { procesos } ) => {

  const navegador = useNavigate();

  const [ procesoSeleccionado, setProcesoSeleccionado ] = useState( null );


  const [ openAccordion, setOpenAccordion ] = useState( "item-estratégico" );

  const handleSeleccionarProceso = ( proceso ) => {
    setProcesoSeleccionado( proceso );
    setOpenAccordion( `item-${ proceso.tipo.toLowerCase() }` );
    navegador( `/proceso/${ proceso.id }` );

  };

  return (
    <section className="flex gap-5  h-full w-1/2 rounded-lg shadow-lg p-4  bg-white">


      <h2 className="font-bold mb-2 text-center border-r-2">Procesos activos</h2>

      <Accordion
        type="single"
        collapsible
        className="w-full h-full"

        value={ openAccordion }
        onValueChange={ setOpenAccordion }
      >
        { [ "Estratégico", "Misional", "Soporte" ].map( ( tipo ) => {
          const procesosPorTipo = procesos
            .filter( ( p ) => p.tipo === tipo )
            .sort( ( a, b ) => a.codigo.localeCompare( b.codigo ) );
          if ( procesosPorTipo.length === 0 ) return null;
          return (
            <AccordionItem value={ `item-${ tipo.toLowerCase() }` } key={ tipo }>
              <AccordionTrigger>
                <span className="font-bold text-base">{ tipo }</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-h-96 overflow-y-auto pr-2">
                  { procesosPorTipo.map( ( proceso ) => (
                    <div
                      key={ proceso.id }
                      className={ `flex items-center justify-between text-md border-b rounded cursor-pointer hover:bg-gray-100 ${ procesoSeleccionado?.id === proceso.id
                        ? "bg-gray-200 font-semibold border-primary"
                        : "bg-white"
                        }` }
                      onClick={ () => handleSeleccionarProceso( proceso ) }
                    >
                      <span
                        className="hover:underline"
                        style={ {
                           marginLeft: `${ ( proceso.nivel || 0 ) * 10 }px`,
                           fontSize: '1rem',
                           
                           padding: '4px 0',
                          } }
                      >
                        { proceso.codigo } - { proceso.nombre }
                      </span>
                    </div>

                  ) ) }
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        } ) }
      </Accordion>






    </section>
  );
};