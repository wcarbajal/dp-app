import { Titulo } from '@/components/titulo/Titulo';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { TbTrashX } from 'react-icons/tb';
import { Link } from 'react-router';
import { BrandPrisma, Edit, Plus } from 'tabler-icons-react';
import { IndicadorItem } from './IndicadorItem';
import { AgregarIndicador } from './AgregarIndicador';


export const IndicadoresProceso = ( { proceso, onIndicadoresAgregados } ) => {
  const indicadores = proceso?.proceso?.indicadores || [];

  

  return (
    <article className='flex flex-col items-center gap-4 w-full'>

      <Titulo titulo="Indicadores del Proceso" />


      <div className='flex flex-col items-center w-full p-4 bg-white rounded-md shadow-md'>

        <AgregarIndicador mapaId={ proceso?.proceso?.mapaId } procesoId={ proceso?.proceso?.id } indicadoresAsociados={ indicadores } onIndicadoresAgregados={ onIndicadoresAgregados } />


        <div className="grid grid-cols-1 gap-4 mt-4 w-full md:grid-cols-2 lg:grid-cols-3">
          { indicadores.length === 0 ? (
            <p className="text-gray-500 py-4">No hay indicadores registrados.</p>
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