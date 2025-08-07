import { AsidebarContext } from '@/context/AsidebarContext';
import { useContext } from 'react';
import { Button } from './ui/button';
import { UserHeader } from './UserHeader';

export const HeaderPrincipal = () => {

  const { asidebarOpen, setAsidebarOpen } = useContext( AsidebarContext );

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow flex items-center px-6 z-50">
      <article className="flex items-center justify-between w-full">
        <div className="flex items-center ">
        <Button
          onClick={ () => setAsidebarOpen( ( v ) => !v ) }
          className="mr-4 px-3 py-2 rounded bg-black text-white hover:bg-slate-600 transition"
        >
          { asidebarOpen ? "⮜" : "⮞" }
        </Button>
        <h1 className="text-lg font-bold">SIGEPRO</h1>
        </div>
        <UserHeader />

      </article>

    </header>
  );
};