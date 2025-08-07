import { CardConfig } from '@/components/CardConfig';
import { fetchConToken } from '@/helpers/fetch';
import { IconCurrentLocation, IconTrendingDown } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { FcWorkflow } from 'react-icons/fc';







export const ConfiguracionesPage = () => {

  const [ cantidades, setCantidades ] = useState( {
    mapas: 0,
    procesos: 0,
    owners: 0,
    usuarios: 0,
    reportes: 0
  } );

  const listConfiguracciones = [
    {
      ruta: '/config/mapa',
      objeto: 'Mapa',
      cantidad: cantidades.mapas,
      icono: <FcWorkflow />
    },
    {
      ruta: '/config/procesos',
      objeto: 'Procesos',
      cantidad: cantidades.procesos,
      icono: <FcWorkflow />
    },
    {
      ruta: '/config/owners',
      objeto: 'Dueños de procesos',
      cantidad: cantidades.owners,
      icono: <IconCurrentLocation className="size-4" />
    },
    {
      ruta: '/config/usuarios',
      objeto: 'Usuarios',
      cantidad: cantidades.usuarios,
      icono: <IconCurrentLocation className="size-4" />
    },
    {
      ruta: '/config/reportes',
      objeto: 'Reportes',
      cantidad: cantidades.reportes,
      icono: <IconTrendingDown className="size-4" />
    }
  ];

  useEffect( () => {
    async function fetchData() {
      // Cambia la URL por la de tu API real
      const cantidades = await fetchConToken( 'mapa/cantidades' );

      if ( cantidades.ok ) {
        setCantidades( cantidades );
      }
    }
    fetchData();
  }, [] ); // Agrega dependencias si es necesario


  return (
    <div className="grid grid-cols-2 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {
        listConfiguracciones.map( ( { ruta, objeto, cantidad, icono } ) => (
          <CardConfig key={ ruta } ruta={ ruta } objeto={ objeto } cantidad={ cantidad } icon={ icono } />
        ) )
      }
    </div>
  );


};