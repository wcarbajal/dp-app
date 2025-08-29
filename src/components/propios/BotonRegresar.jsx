import React, { useContext } from 'react';
import { Link } from 'react-router';
import { AsidebarContext } from '@/context/AsidebarContext';
import { TiArrowBackOutline } from 'react-icons/ti';
import { Button } from '../ui/button';

export const BotonRegresar = ( { url, nombre } ) => {

  const { asidebarOpen } = useContext( AsidebarContext );


  return (
    <Button className={ `fixed top-16  ${ asidebarOpen ? "left-52" : "left-4" } z-50 m-1  rounded-full px-4 py-2 shadow-lg bg-primary/20 hover:bg-primary transition-all duration-250` }>
      <Link
        to={ url }
        className="flex"
        >
        
      <TiArrowBackOutline /> { nombre }
    </Link>
    </Button >
  );
};