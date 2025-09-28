import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fetchConToken } from '@/helpers/fetch';
import React from 'react';
import { TbTrash } from 'react-icons/tb';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { Edit, Trash } from 'tabler-icons-react';

export const IndicadorItem = ( { indicador, proceso, onIndicadoresAgregados } ) => {

  const eliminarIndicadorDeProceso = async ( indicadorId ) => {

    const eliminarIndicador = await fetchConToken( `indicador/sin-proceso/${ indicadorId }`, {}, 'GET' );

    if ( eliminarIndicador.ok ) {

      // Notificar al componente padre para recargar los indicadores
      if ( onIndicadoresAgregados ) {
        onIndicadoresAgregados();
        await Swal.fire( {
          title: 'Indicador eliminado',
          text: "El indicador ha sido eliminado correctamente.",
          icon: 'success',
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
          }
        } );
      }
    } else {
      console.log( 'Error al eliminar el indicador del proceso:', eliminarIndicador.msg );
      await Swal.fire( {
        title: 'Indicador eliminado',
        text: "El indicador ha sido eliminado correctamente.",
        icon: 'success',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        }
      } );
    }

  };
  return (
    <Card key={ indicador.codigo } className='m-0 p-0 px-5 bg-slate-100 shadow-lg border border-gray-200'>
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
      <CardFooter className="flex justify-end gap-2 mb-2 ">
        <Link
          to={ `/indicador/${ indicador.id }` }
          state={ { from: 'proceso', procesoId: proceso.proceso.id } }
          className="text-blue-500 hover:underline"
        >
          <Button variant="outline" className="w-full">
            <Edit color="black" />
          </Button>
        </Link>
        <Button variant="outline" className="" onClick={ () => eliminarIndicadorDeProceso( indicador.id ) }>
          <Trash color="black" />
        </Button>
      </CardFooter>
    </Card>
  );
}

