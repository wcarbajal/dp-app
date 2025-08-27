import { CreateEditProceso } from '@/components/configuraciones/procesos-config/CrearEditarProceso';
import { Button } from '@/components/ui/button';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import { Link } from 'react-router';



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

export const renderProcesoTreeVertical = ( proceso, handleEliminar, listadoProcesos, cargarProcesos ) => (



  <div key={ proceso.id } className="relative ">
    <div className="flex items-center justify-between   rounded-xl px-3 py-2 min-w-[400px] z-5  shadow-lg bg-[#E5E8F7] border-1">
      <Link to={ `/proceso/${ proceso.id }` }>
        <div className="flex flex-col pl-2 gap-2">
          <p className="font-semibold">{ proceso.codigo } - { proceso.nombre }</p>
          <p className="text-sm text-muted-foreground">{ proceso.descripcion }</p>
        </div>
      </Link>
      <div className="flex gap-2">
        {/* Si necesitas el console.log, colócalo fuera del JSX */ }
        <CreateEditProceso
          listadoProcesos={ listadoProcesos }
          proceso={ proceso }
          cargarProcesos={ cargarProcesos }
        />
        <Button variant="destructive" size="icon" onClick={ () => handleEliminar( proceso.id ) }>
          <MdDeleteOutline />
        </Button>

      </div>
    </div>
    { proceso.hijos.length > 0 && (
      <div className="ml-6 border-l-2 border-gray-300 pl-4 my-2 ">
        { proceso.hijos.map( hijo => (
          <div key={ hijo.id } className="relative my-2">

            <div className="absolute -left-6 top-0 h-full border-l-2 border-gray-300 m-1.5 "></div>
            { renderProcesoTreeVertical( hijo, handleEliminar, listadoProcesos, cargarProcesos ) }
          </div>
        ) ) }
      </div>
    ) }
  </div>

);
