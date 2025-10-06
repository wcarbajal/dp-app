import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';


export const Paginacion = ( { totalItems, itemsPorPagina, paginaActual, setPaginaActual, setItemsPorPagina } ) => {

  const mostrarTodos = itemsPorPagina === 0;

  const totalPaginas = mostrarTodos ? 1 : Math.ceil( totalItems / itemsPorPagina );

  return (
    <div className="flex items-center gap-4 -mt-5 mb-4 bg-white p-2 rounded-lg">
      <Label htmlFor="itemsPorPagina">Mostrar:</Label>
      <Select
        id="itemsPorPagina"
        value={ itemsPorPagina }
        onValueChange={ value => {
          setItemsPorPagina( value );
          setPaginaActual( 1 );
        } }
        className="border rounded px-2 py-1"
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cantidad</SelectLabel>
            <SelectItem key="items-10" value={ 10 }>10</SelectItem>
            <SelectItem key="items-20" value={ 20 }>20</SelectItem>
            <SelectItem key="items-30" value={ 30 }>30</SelectItem>
            <SelectItem key="items-0" value={ 0 }>Todos</SelectItem>
          </SelectGroup>
        </SelectContent>

      </Select>
      { !mostrarTodos && (
        <div className="flex gap-2 items-center">
          <Button
            className="px-2 py-1 border rounded"
            variant="outline"
            disabled={ paginaActual === 1 }
            onClick={ () => setPaginaActual( paginaActual - 1 ) }
          >
            <MdKeyboardArrowLeft size={ 20 } />
          </Button>
          <span>
            Página { paginaActual } de { totalPaginas }
          </span>
          <button
            className="px-2 py-1 border rounded"
            disabled={ paginaActual === totalPaginas }
            onClick={ () => setPaginaActual( paginaActual + 1 ) }
          >
            <MdKeyboardArrowRight size={ 20 } />
          </button>
        </div>
      ) }
    </div>
  );
};