
import { ListaProcesos } from '@/components/procesos/ListaProcesos';
//import { useState } from 'react';

export const ProcesoPage = () => {

  /*  const [ procesos, setProcesos ] = useState( [] );
    const [ tipoFiltro, setTipoFiltro ] = useState( "" ); */
  return (
   <div className="flex-1 min-h-0 h-full ">
      
        <ListaProcesos />
      

     
    </div>
  );
};