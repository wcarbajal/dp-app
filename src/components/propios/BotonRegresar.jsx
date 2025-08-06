import React from 'react';
import { Link } from 'react-router';
import { useSidebar } from '../ui/sidebar';
import { TiArrowBackOutline } from 'react-icons/ti';

export const BotonRegresar = ( { url, nombre } ) => {

  const { open } = useSidebar();


  return (
    <Link
      to={ url }
      className={ `fixed top-16  ${ open ? "left-52" : "left-4" } z-50  text-blue-500 rounded-full px-4 py-2 shadow-lg hover:bg-primary/20 transition-all duration-250` }>
      <div className="flex items-center gap-2">
        <TiArrowBackOutline /> { nombre }
      </div>
    </Link>
  );
};