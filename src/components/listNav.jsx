import {
  
  IconCamera,
  IconFileDescription,
  IconFileAi,
  IconSettings,
  IconHelp,
  IconSearch,
  IconDatabase,
  IconReport,
  IconFileWord
} from '@tabler/icons-react';
import { FaUsers } from 'react-icons/fa6';
import { GoWorkflow } from "react-icons/go";
import { FcFlowChart } from "react-icons/fc";
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