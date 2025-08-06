import { AuthContext } from '@/auth/AuthContext';
import { AppSidebar } from "@/components/app-sidebar";
import { AsideBar } from '@/components/AsideBar';
import { itemsNav } from '@/components/listNav';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
/* import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table" */
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Separator } from '@/components/ui/separator';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {  useState } from 'react';
import { TiFlowMerge } from 'react-icons/ti';
import { Link, Outlet } from 'react-router';

//import data from "./data.json"

/* 
export const PrincipalPage = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 50)",
          "--header-height": "calc(var(--spacing) * 12)",
        }
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
              <Outlet />
            
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} */
/* export const metadata = {
  title: "Dashboard",
  description: "Dashboard page with interactive charts and data tables.",
} */

  // importar items de listNav.jsx
  


export const PrincipalPage = () => {

  const [ sidebarOpen, setSidebarOpen ] = useState( true );
  const items = itemsNav.navMain;

  return (
    <>
      {/* Header superior izquierdo */ }
      <header className="fixed top-0 left-0 w-full h-16 bg-white shadow flex items-center px-6 z-50">
        <button
          onClick={ () => setSidebarOpen( ( v ) => !v ) }
          className="mr-4 px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          { sidebarOpen ? "⮜" : "⮞" }
        </button>
        <h1 className="text-xl font-bold">Mi Página Web</h1>
      </header>

      {/* Barra de navegación derecha */ }
      <AsideBar open={ sidebarOpen } items={ items } />

      {/* Espacio para el contenido principal */ }
      <main
        className={ `pt-20 px-8 bg-red-300 transition-all duration-300 ${ sidebarOpen ? "ml-62" : "ml-6"
          }` }
      >
        {/* Aquí va el contenido principal */ }

       

          <Outlet />


        
      </main>
    </>
  );
};