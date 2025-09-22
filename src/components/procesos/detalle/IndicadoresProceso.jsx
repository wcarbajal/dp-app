import { Card } from '@/components/ui/card';
import React from 'react';

export const IndicadoresProceso = ({ proceso }) => {
  console.log({proceso})
  const indicadores = proceso.indicadores || [];
  
  return (
    <article className='flex flex-col items-center gap-4 w-full'>
      <Card className='m-0 p-0 px-5'>
        <h2 className='text-lg font-bold'>Indicadores del Proceso</h2>
      </Card>
      <Card className='m-0 p-0 px-5 w-full'>
        {indicadores.length === 0 ? (
          <p className="text-gray-500 py-4">No hay indicadores registrados.</p>
        ) : (
          <ul className="divide-y">
            {indicadores.map(indicador => (
              <li key={indicador.id} className="py-2">
                <span className="font-semibold">{indicador.codigo}</span> - {indicador.nombre}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </article>
  );
};