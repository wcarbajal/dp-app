import { IconCurrentLocation, IconTrendingDown } from "@tabler/icons-react";
import { FcWorkflow } from "react-icons/fc";


import { CardConfig } from '@/components/CardConfig';

const listConfiguracciones = [
  {
    ruta: '/config/mapa',
    objeto: 'Mapa',
    cantidad: 96,
    icono: <FcWorkflow />
  },
  {
    ruta: '/config/procesos',
    objeto: 'Procesos',
    cantidad: 96,
    icono: <FcWorkflow />
  },
   {
    ruta: '/config/owners',
    objeto: 'Dueños de procesos',
    cantidad: 12,
    icono: <IconCurrentLocation className="size-4" />
  },
  {
    ruta: '/config/usuarios',
    objeto: 'Usuarios',
    cantidad: 12,
    icono: <IconCurrentLocation className="size-4" />
  },
  {
    ruta: '/config/reportes',
    objeto: 'Reportes',
    cantidad: 5,
    icono: <IconTrendingDown className="size-4" />
  }
];
export const ConfiguracionesPage = () => {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {
        listConfiguracciones.map( ( { ruta, objeto, cantidad, icono } ) => (
          <CardConfig key={ ruta } ruta={ ruta } objeto={ objeto } cantidad={ cantidad } icon={ icono } />
        ) )
      }
    </div>
  );


};