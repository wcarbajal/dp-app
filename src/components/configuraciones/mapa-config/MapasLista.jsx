import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchConToken } from '@/helpers/fetch';
import { useState } from 'react';
import { MapaFormActualizacion } from './MapaFormActualizacion';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { CiEdit } from "react-icons/ci";
import { EntidadContext } from '@/context/EntidadContext';


export const MapasLista = ( { mapas, cargarMapas } ) => {

  

  const [ open, setOpen ] = useState( false );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );

  const eliminarMapa = async ( item ) => {
    try {
      const respuesta = await fetchConToken( `mapa/eliminar/${ item.id }`, {}, "DELETE" );

      if ( respuesta.ok ) {

        if ( cargarMapas ) cargarMapas();
      } else {
        console.error( "Error al eliminar el mapa:", respuesta.error );
      }
    } catch ( error ) {
      console.error( "Error al eliminar el mapa:", error );
    }
  };

  const actualizarMapa = async ( item ) => {

    setMapaSeleccionado( item );

    setOpen( true );
    if ( cargarMapas ) cargarMapas();


  };


  return (
    <div className=" w-full">
      <Table className="bg-white rounded-lg overflow-hidden m-5 table-fixed p-5">
        <TableHeader>
          <TableRow className="bg-slate-400 border font-bold text-center hover:bg-slate-400">
            <TableHead className="border-r border-gray-300 w-6 ">#</TableHead>
            <TableHead className="border-r border-gray-300 w-12">RUC</TableHead>
            <TableHead className="border-r border-gray-300 w-24">Nombre</TableHead>
            <TableHead className="border-r border-gray-300 w-24">Entrada</TableHead>
            <TableHead className="border-r border-gray-300 w-24">Salida</TableHead>
            <TableHead className="border-r border-gray-300 w-24">Descripción</TableHead>
            <TableHead className="w-6">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { [ ...mapas ]
            .sort( ( a, b ) => a.nombre.localeCompare( b.ruc ) )
            .map( ( mapa, index ) => (
              <TableRow key={ index } className="hover:bg-gray-200">
                <TableCell className="border-r border-gray-300 w-6">{ index + 1 }</TableCell>
                <TableCell className="border-r border-gray-300 w-12">{ mapa.ruc }</TableCell>
                <TableCell className="border-r border-gray-300 w-24 whitespace-pre-line">{ mapa.nombre }</TableCell>
                <TableCell className="border-r border-gray-300 w-24 whitespace-pre-line align-top">{ mapa.entrada }</TableCell>
                <TableCell className="border-r border-gray-300 w-24 whitespace-pre-line align-top">{ mapa.salida }</TableCell>
                <TableCell className="border-r border-gray-300 w-24 whitespace-pre-line align-top">{ mapa.descripcion }</TableCell>
                <TableCell className="w-6">
                  <div className="flex  gap-2 ">

                    <Button
                      variant=""
                      onClick={ () => actualizarMapa( mapa ) }
                    >
                      <CiEdit />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={ () => eliminarMapa( mapa ) }
                    >
                      <MdOutlineDeleteForever />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) ) }
        </TableBody>
      </Table>
      <Dialog open={ open } onOpenChange={ setOpen }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Mapa</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            Completa los campos para editar el mapa de procesos.
          </DialogDescription>

          { mapaSeleccionado && (
            <MapaFormActualizacion
              mapaSeleccionado={ mapaSeleccionado }
              cargarMapas={ cargarMapas }
              setOpen={ setOpen }
            />
          ) }

        </DialogContent>
      </Dialog>

    </div>
  );
};