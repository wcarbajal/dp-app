import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchConToken } from '@/helpers/fetch';

export const MapasView = ( { mapa} ) => {

  const eliminarMapa = async ( item ) => {
    try {
      const respuesta = await fetchConToken( `mapa/${ item._id }`, {}, "DELETE" );
      if ( respuesta.ok ) {
        console.log( "Mapa eliminado correctamente" );
      } else {
        console.error( "Error al eliminar el mapa:", respuesta.error );
      }
    } catch ( error ) {
      console.error( "Error al eliminar el mapa:", error );
    }
  }

  const actualisarMapa = async ( item ) => {
    try {
      const respuesta = await fetchConToken( `mapa/${ item._id }`, item, "PUT" );
      if ( respuesta.ok ) {
        console.log( "Mapa actualizado correctamente" );
      } else {
        console.error( "Error al actualizar el mapa:", respuesta.error );
      }
    } catch ( error ) {
      console.error( "Error al actualizar el mapa:", error );
    }
  }

  return (
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead>RUC</TableHead>
        <TableHead>Nombre</TableHead>
        <TableHead>Entrada</TableHead>
        <TableHead>Salida</TableHead>
        <TableHead>Acciones</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      { mapa.map( ( item, index ) => (
        <TableRow key={ index }>
          <TableCell>{ item.ruc }</TableCell>
          <TableCell>{ item.nombre }</TableCell>
          <TableCell>{ item.entrada }</TableCell>
          <TableCell>{ item.salida }</TableCell>
          <TableCell>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
          onClick={() => actualisarMapa(item)}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => eliminarMapa(item)}
        >
          Borrar
        </button>
      </TableCell>
        </TableRow>
      ) ) }
    </TableBody>
  </Table>
  )
}