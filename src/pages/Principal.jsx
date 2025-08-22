
import { AsideBar } from '@/components/AsideBar';
import { itemsNav } from '@/components/listNav';
import { Outlet } from 'react-router';
import { AsidebarContext } from '@/context/AsidebarContext';
import { useContext } from 'react';
import { HeaderPrincipal } from '@/components/HeaderPrincipal';




export const PrincipalPage = ({ children }) => {


  const { asidebarOpen } = useContext( AsidebarContext );

  //const [ sidebarOpen, setSidebarOpen ] = useState( true );

  const items = itemsNav.navMain;
  const itemsSecundarios = itemsNav.navSecondary;

  return (
    <>
      {/* Header superior izquierdo */ }
     <HeaderPrincipal />

      {/* Barra de navegación derecha */ }
      <AsideBar open={ asidebarOpen } items={ items } itemsSecundarios={ itemsSecundarios } />

      {/* Espacio para el contenido principal */ }
      <main
        className={ `flex-1 overflow-y-auto pt-18  bg-slate-200 transition-all duration-300 ${ asidebarOpen ? "ml-50" : "ml-0"
          }` }
      >
        {/* Aquí va el contenido principal */ }



        <Outlet />

        {children}

      </main>
    </>
  );
};