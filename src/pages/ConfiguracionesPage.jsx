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

    },
    {
      ruta: '/config/procesos',
      objeto: 'Procesos',
      cantidad: cantidades.procesos,

    },
    {
      ruta: '/config/owners',
      objeto: 'Dueños de procesos',
      cantidad: cantidades.owners,

    },
    {
      ruta: '/config/usuarios',
      objeto: 'Usuarios',
      cantidad: cantidades.usuarios,

    },
    {
      ruta: '/config/reportes',
      objeto: 'Reportes',
      cantidad: cantidades.reportes,

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 w-full h-96">
      {
        listConfiguracciones.map( ( { ruta, objeto, cantidad, icono } ) => (
          <CardConfig key={ ruta } ruta={ ruta } objeto={ objeto } cantidad={ cantidad } icon={ icono } />
        ) )
      }
    </div>
  );


};