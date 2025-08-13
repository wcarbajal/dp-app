import { FormEntradasSalidas } from './ficha-proceso/FormEntradasSalidas';
import { FormRiesgos } from './ficha-proceso/FormRiesgos';
import { FormRegistros } from './ficha-proceso/FormRegistros';
import { Badge } from '@/components/ui/badge';



export const FichaProceso = ( { proceso } ) => {

  console.log( { proceso } );


  return (
    <section className="flex flex-col w-full h-full bg-gray-400 rounded-lg  m-0 gap-2">
      <h3 className="text-lg text-center my-4 ">
        <Badge variant="secondary" className="text-xl">Ficha del Proceso</Badge>
      </h3>

      {/* Primera tabla */ }
      <FormEntradasSalidas proceso={ proceso } />
      {/* Tabla de riesgos */ }
      <FormRiesgos procesoId={ proceso.id } />
      {/* Tabla de registros */ }
      <FormRegistros procesoId={ proceso.id } />


    </section>
  );
};