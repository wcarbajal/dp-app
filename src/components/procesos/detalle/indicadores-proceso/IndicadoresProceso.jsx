import { Titulo } from '@/components/titulo/Titulo';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { TbTrashX } from 'react-icons/tb';
import { Link } from 'react-router';
import { BrandPrisma, Edit, Plus } from 'tabler-icons-react';
import { IndicadorItem } from './IndicadorItem';
import { AgregarIndicador } from './AgregarIndicador';


export const IndicadoresProceso = ( { proceso, onIndicadoresAgregados } ) => {
  const indicadores = proceso?.indicadores || [];



  return (
    <article className='flex flex-col items-center gap-4 w-full'>


      <div className='flex flex-col  w-full p-4 bg-white rounded-md shadow-md'>
        <div className='flex justify-between'>
          <CardHeader className="flex flex-col w-full">
            <CardTitle>Indicadores del Proceso</CardTitle>
            <CardDescription>Listado de indicadores del proceso</CardDescription>
          </CardHeader>

          <AgregarIndicador mapaId={ proceso?.mapaId } procesoId={ proceso?.id } indicadoresAsociados={ indicadores } onIndicadoresAgregados={ onIndicadoresAgregados } />

        </div>
        <Separator className="my-2" />

        <div className="grid grid-cols-1 gap-4 mt-4 w-full md:grid-cols-2 lg:grid-cols-3 px-4 auto-rows-fr " >
          { indicadores.length === 0 ? (
            <span className="flex text-gray-500 text-sm px-2 w-full">No hay indicadores registrados.</span>
          ) : (
            indicadores.sort( ( a, b ) => {
              // Definir el orden de prioridad para nivelIndicador
              const nivelOrder = { 'OEI': 1, 'AEI': 2, 'PE': 3, 'AO': 4, 'IG': 5 };

              // Definir el orden de prioridad para tipoIndicador
              const tipoOrder = { 'IR': 1, 'IP': 2, 'IA': 3 };

              // Ordenar primero por nivelIndicador
              const nivelComparison = ( nivelOrder[ a.nivelIndicador ] || 999 ) - ( nivelOrder[ b.nivelIndicador ] || 999 );

              if ( nivelComparison !== 0 ) {
                return nivelComparison;
              }

              // Si el nivel es igual, ordenar por tipoIndicador
              const tipoComparison = ( tipoOrder[ a.tipoIndicador ] || 999 ) - ( tipoOrder[ b.tipoIndicador ] || 999 );

              if ( tipoComparison !== 0 ) {
                return tipoComparison;
              }

              // Si ambos son iguales, ordenar por ID como fallback
              return a.id - b.id;
            } ).map( ( indicador ) => (
              <IndicadorItem key={ indicador.id } indicador={ indicador } proceso={ proceso } onIndicadoresAgregados={ onIndicadoresAgregados } />
            ) )
          ) }
        </div>
      </div>
    </article>
  );
};