import { Button } from '@/components/ui/button';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';



export const getProcesosTree = ( procesos, tipoFiltro ) => {
  const filtrados = tipoFiltro && tipoFiltro !== "*"
    ? procesos.filter( p => p.tipo === tipoFiltro )
    : procesos;
  const map = {};
  filtrados.forEach( p => {
    map[ p.id ] = { ...p, hijos: [] };
  } );
  filtrados.forEach( p => {
    if ( p.parentId && map[ p.parentId ] ) {
      map[ p.parentId ].hijos.push( map[ p.id ] );
    }
  } );
  Object.values( map ).forEach( padre => {
    padre.hijos.sort( ( a, b ) => a.codigo.localeCompare( b.codigo ) );
  } );
  return Object.values( map )
    .filter( p => !p.parentId )
    .sort( ( a, b ) => a.codigo.localeCompare( b.codigo ) );
};

export const renderProcesoTreeVertical = ( proceso, handleEditar, handleEliminar, isEliminar ) => (

  <div key={ proceso.id } className="relative">
    <div className="flex items-center justify-between border rounded px-3 py-2 min-w-[400px] bg-white z-10">
      <div>
        <span className="font-semibold">{ proceso.codigo }</span> - { proceso.nombre }
        <div className="text-xs text-muted-foreground">{ proceso.descripcion }</div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={ () => handleEditar( proceso ) }>
          <MdEdit />
        </Button>

        { isEliminar && (
          <Button variant="destructive" size="icon" onClick={ () => handleEliminar( proceso.id ) }>
            <MdDeleteOutline />
          </Button>
        ) }
      </div>
    </div>
    { proceso.hijos.length > 0 && (
      <div className="ml-6 border-l-2 border-gray-300 pl-4">
        { proceso.hijos.map( hijo => (
          <div key={ hijo.id } className="relative">

            <div className="absolute -left-6 top-0 h-full border-l-2 border-gray-300"></div>
            { renderProcesoTreeVertical( hijo, handleEditar, handleEliminar ) }
          </div>
        ) ) }
      </div>
    ) }
  </div>

);
