import {
  
  IconCamera,
  IconFileDescription,
  IconFileAi,
  IconSettings,
  IconHelp,
  IconSearch,
  IconDatabase,
  IconReport,
  IconFileWord,
  IconCurrentLocation,
  IconTrendingDown
} from '@tabler/icons-react';
import { FaUsers } from 'react-icons/fa6';
import { GoWorkflow } from "react-icons/go";
import { FcFlowChart, FcWorkflow } from "react-icons/fc";
import { BsFileBarGraph } from "react-icons/bs";
import { BiTachometer } from "react-icons/bi";



export const itemsNav = {

  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: BiTachometer ,
    },
    {
      title: "Mapa",
      url: "/mapa",
      icon: FcFlowChart ,
    },
    {
      title: "Procesos",
      url: "/procesos",
      icon: GoWorkflow,
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: BsFileBarGraph,
    },
    {
      title: "Equipo",
      url: "/equipo",
      icon: FaUsers,
    },
  ],
 
  navSecondary: [
    {
      title: "Configuraciones",
      url: "/config",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export const listConfiguracciones = [
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