import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { TbTrashX } from 'react-icons/tb';
import { Link } from 'react-router';
import { Edit } from 'tabler-icons-react';

export const IndicadoresProceso = ( { proceso } ) => {
  const indicadores = proceso?.proceso?.indicadores || [];
  console.log( 'IndicadoresProceso - indicadores:', indicadores );


  const eliminarIndicadorDeProceso = ( id ) => {
    console.log("Procesos actual", proceso?.proceso?.id)
    console.log( 'Eliminar indicador con ID:', id );
    // Aquí puedes agregar la lógica para eliminar el indicador
  }


  return (
    <article className='flex flex-col items-center gap-4 w-full'>
      <Card className='m-0 p-0 px-5'>
        <h2 className='text-lg font-bold'>Indicadores del Proceso</h2>
      </Card>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

        { indicadores.length === 0 ? (
          <p className="text-gray-500 py-4">No hay indicadores registrados.</p>
        ) : (
          indicadores.map( ( indicador, index ) => (
            <Card key={ index } className='m-0 p-0 px-5 '>
              <div className="mb-4 p-4">
                <h3 className="text-md font-semibold mb-2">{ indicador.codigo } - { indicador.nombre }</h3>
                <Separator className="my-2" />
                <p className="text-gray-700 mb-1"><span className="font-semibold">Descripción:</span> { indicador.descripcion }</p>
                <div className="text-gray-700 mb-1">
                  <span className="font-semibold">Fórmula:</span>
                  <math-field
                    read-only
                    value={ indicador.formula || '' }
                    style={ {
                      display: 'inline-block',
                      marginLeft: '8px',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '16px'
                    } }
                  />
                </div>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Frecuencia de Medición:</span> { indicador.frecuencia }</p>
                <p className="text-gray-700"><span className="font-semibold">Fuente:</span> { indicador.fuenteDatos }</p>
              </div>
              <CardFooter className="flex justify-end gap-2 ">
                <Link to={ `/indicador/${ indicador.id }` } className="text-blue-500 hover:underline">
                  <Button variant="outline" className="w-full">
                    <Edit color="black" />
                  </Button>
                </Link>
                <Button variant="outline" className="" onClick={ () => eliminarIndicadorDeProceso( indicador.id ) }>
                  <TbTrashX color="black" />
                </Button>
              </CardFooter>
            </Card>
          ) )
        ) }

      </div>
    </article>
  );
};