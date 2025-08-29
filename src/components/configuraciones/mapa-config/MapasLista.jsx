import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchConToken } from '@/helpers/fetch';
import { useContext, useState } from 'react';
import { MapaFormActualizacion } from './MapaFormActualizacion';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { TbSitemap } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { EntidadContext } from '@/context/EntidadContext';
import { TooltipContent, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { Chrome } from "lucide-react";


export const MapasLista = ( { mapas, cargarMapas } ) => {

  const { defaultEntidad, setDefaultEntidad } = useContext( EntidadContext );

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

  const entidadSeleccionada = ( mapa ) => {
    console.log( "mapa seleccionado", mapa );
  };


  return (
    <div className="w-full overflow-x-auto " >
      <Table className="w-full rounded-lg overflow-hidden bg-white">
        <TableHeader>
          <TableRow className="bg-slate-400 border font-bold text-center hover:bg-slate-400">
            <TableHead className="border-r border-gray-300 ">#</TableHead>

            <TableHead className="border-r border-gray-300 ">RUC</TableHead>
            <TableHead className="border-r border-gray-300  w-[300px]">Nombre</TableHead>
            <TableHead className="border-r border-gray-300 w-[300px] ">Entrada</TableHead>
            <TableHead className="border-r border-gray-300 w-[300px] ">Salida</TableHead>
            <TableHead className="border-r border-gray-300 w-[200px] ">Descripción</TableHead>
            <TableHead className="">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { [ ...mapas ]
            .sort( ( a, b ) => a.nombre.localeCompare( b.ruc ) )
            .map( ( mapa, index ) => (
              <TableRow key={ index } className="hover:bg-gray-200">
                <TableCell className="border-r border-gray-300">{ index + 1 }</TableCell>
                <TableCell className="border-r border-gray-300">{ mapa.ruc }</TableCell>
                <TableCell className="border-r border-gray-300 whitespace-pre-line ">{ mapa.nombre }</TableCell>
                <TableCell className="border-r border-gray-300 w-[300px] whitespace-pre-line align-top">{ mapa.entrada }</TableCell>
                <TableCell className="border-r border-gray-300 w-[300px] whitespace-pre-line align-top ">{ mapa.salida }</TableCell>
                <TableCell className="border-r border-gray-300 w-[200px] whitespace-pre-line align-top ">{ mapa.descripcion }</TableCell>
                <TableCell className="">
                  <div className="flex gap-2 ">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant=""
                          onClick={ () => entidadSeleccionada( mapa ) }
                        >
                          <TbSitemap />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Seleccionar mapa</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant=""
                          onClick={ () => actualizarMapa( mapa ) }
                        >
                          <CiEdit />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar mapa</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={ () => eliminarMapa( mapa ) }
                        >
                          <MdOutlineDeleteForever />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Eliminar mapa</p>
                      </TooltipContent>
                    </Tooltip>
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