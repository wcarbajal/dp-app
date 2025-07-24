import { IconCurrentLocation, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { FcWorkflow } from "react-icons/fc";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdOutlineNumbers } from 'react-icons/md';
import { Link } from 'react-router';
import { CardConfig } from '@/components/CardConfig';

const listConfiguracciones = [
  {
    ruta: '/configuraciones/procesos',
    objeto: 'Procesos',
    cantidad: 96,
    icono: <FcWorkflow />
  },
  {
    ruta: '/configuraciones/usuarios',
    objeto: 'Usuarios',
    cantidad: 12,
    icono: <IconCurrentLocation className="size-4" />
  },
  {
    ruta: '/configuraciones/reportes',
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