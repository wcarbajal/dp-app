import {  useState } from "react";
import { Button } from "@/components/ui/button";

import { MdEdit } from "react-icons/md";
import { DetalleProceso } from './DetalleProceso';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ListaProcesos = ( { procesos } ) => {

  const [ procesoSeleccionado, setProcesoSeleccionado ] = useState( null );
  const [ colapsado, setColapsado ] = useState( false );

 const [ openAccordion, setOpenAccordion ] = useState("item-estratégico");

const handleSeleccionarProceso = (proceso) => {
    setProcesoSeleccionado(proceso);
    setOpenAccordion(`item-${proceso.tipo.toLowerCase()}`);
  };

  return (
    <section className="flex gap-7  h-full w-full rounded-lg shadow-lg p-4  bg-white">
      <div className={ `flex flex-col gap-2 h-ull relative transition-all duration-300 ${ colapsado ? "w-0 p-0" : "w-1/3" }` }>

        { !colapsado ? (
          <article className=" p-4 border rounded-lg shadow-lg h-full">

            <h2 className="font-bold mb-2 text-center">Procesos activos</h2>

            <Accordion
              type="single"
              collapsible
              className="w-full h-full"
              
              value={openAccordion}
              onValueChange={setOpenAccordion}
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
                            className={ `flex items-center justify-between text-sm border-b rounded cursor-pointer hover:bg-gray-100 ${ procesoSeleccionado?.id === proceso.id
                              ? "bg-gray-200 font-semibold border-primary"
                              : "bg-white"
                              }` }
                            onClick={ () => handleSeleccionarProceso(proceso)  }
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

          </article>
        )
          : (
            <div
              className="w-9  flex items-end justify-center flex-col  mt-8  h-96"
              style={ { writingMode: "vertical-rl", transform: "rotate(180deg)" } }
            >
              <span className="text-md font-semibold">{ procesoSeleccionado?.codigo } - { procesoSeleccionado.nombre }</span>
              
            </div>
          )
        }

      </div>

      <article
        className={ `transition-all duration-300 border h-full rounded-lg shadow-lg p-5  -ml-6 pt-2 pl-2 ${ colapsado ? "flex-1 w-full ml-1" : "flex-1"
          }` }
      >
        { procesoSeleccionado ? (
          <>
            <div className="relative bg-white">

              <Button
                size="sm"
                variant=""
                className=" rounded-4xl absolute -left-10 -top-5"
                onClick={ () => setColapsado( ( v ) => !v ) }
              >
                { !colapsado ? "⮜" : "⮞" }
              </Button>
            </div>
            <DetalleProceso procesoId={ procesoSeleccionado.id } />
          </>

        ) : (
          <div className="text-muted-foreground">Seleccione un proceso para el detalle.</div>
        ) }
      </article>
    </section>
  );
};