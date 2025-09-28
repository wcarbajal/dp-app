import React, { useCallback, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, Search } from 'tabler-icons-react';
import { fetchConToken } from '@/helpers/fetch';
import Swal from 'sweetalert2';

export const AgregarIndicador = ( { mapaId, procesoId, onIndicadoresAgregados } ) => {
  const [ indicadoresDisponibles, setIndicadoresDisponibles ] = useState( [] );
  const [ selectedIndicadores, setSelectedIndicadores ] = useState( [] );
  const [ open, setOpen ] = useState( false );
  const [ filtro, setFiltro ] = useState( '' );


  const cargarIndicadores = useCallback( async () => {
    if ( !mapaId ) return;

    try {
     
      const listaIndicadores = await fetchConToken( `indicador/${ mapaId }/disponibles` );

      // Ya no necesitamos filtrar porque el backend solo retorna indicadores sin procesoId
      setIndicadoresDisponibles( listaIndicadores.indicadores || [] );
    } catch ( error ) {
      console.log( '🔴 Error al cargar indicadores:', error );
    }
  }, [ mapaId ] );

  useEffect( () => {

    if ( open ) {
      cargarIndicadores();
    }
  }, [ cargarIndicadores, open ] );

  // Filtrar indicadores basado en el input
  const indicadoresFiltrados = indicadoresDisponibles.filter( indicador => {
    if ( !filtro ) return true;

    const filtroLower = filtro.toLowerCase();
    return (
      indicador.nombre?.toLowerCase().includes( filtroLower ) ||
      indicador.codigo?.toLowerCase().includes( filtroLower ) ||
      indicador.nivelIndicador?.toLowerCase().includes( filtroLower ) ||
      indicador.tipoIndicador?.toLowerCase().includes( filtroLower ) ||
      indicador.descripcion?.toLowerCase().includes( filtroLower )
    );
  } );

  // Manejar selección/deselección de indicadores
  const handleCheckboxChange = ( indicadorId, checked ) => {
    if ( checked ) {
      setSelectedIndicadores( prev => [ ...prev, indicadorId ] );
    } else {
      setSelectedIndicadores( prev => prev.filter( id => id !== indicadorId ) );
    }
  };

  // Limpiar filtro y selecciones al cerrar
  const handleOpenChange = ( isOpen ) => {
    setOpen( isOpen );
    if ( !isOpen ) {
      setFiltro( '' );
      setSelectedIndicadores( [] );
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async ( e ) => {
    e.preventDefault();
    const multiple = selectedIndicadores.length > 1;
   

    try {
      const solicitud = await fetchConToken( 'procesos/actualizar-indicadores', { procesoId, indicadores: selectedIndicadores }, 'POST' );

     

      // Si el envío fue exitoso, llamar al callback del componente padre
      if ( onIndicadoresAgregados && solicitud.ok !== false ) {
        await onIndicadoresAgregados();
        await Swal.fire( {
          title: multiple ? 'Indicadores agregados' : 'Indicador agregado',
          text: multiple ? "Los indicadores han sido agregados correctamente." : "El indicador ha sido agregado correctamente.",
          icon: 'success',
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
          }
        } );
      }

      // Limpiar selección y cerrar dialog
      setSelectedIndicadores( [] );
      setFiltro( '' );
      setOpen( false );
    } catch ( error ) {
      console.error( '🔴 Error al agregar indicadores:', error );
    }
  };

  return (
    <Dialog open={ open } onOpenChange={ handleOpenChange }>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Agregar indicador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={ handleSubmit }>
          <DialogHeader>
            <DialogTitle>Indicadores disponibles</DialogTitle>
            <DialogDescription>
              Selecciona los indicadores para el proceso actual.
            </DialogDescription>
          </DialogHeader>

          {/* Campo de filtro */ }
          <div className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={ 16 } />
              <Input
                placeholder="Filtrar por nombre, código, nivel o tipo..."
                value={ filtro }
                onChange={ ( e ) => setFiltro( e.target.value ) }
                className="pl-10"
              />
            </div>
            { filtro && (
              <div className="text-sm text-gray-500 mt-2">
                { indicadoresFiltrados.length } de { indicadoresDisponibles.length } indicadores mostrados
              </div>
            ) }
          </div>

          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            { indicadoresFiltrados.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">
                { filtro
                  ? `No se encontraron indicadores que coincidan con "${ filtro }"`
                  : "No hay indicadores disponibles para agregar."
                }
              </p>
            ) : (
              <div className="space-y-3">
                { indicadoresFiltrados.map( ( indicador ) => (
                  <div key={ indicador.id } className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={ `indicador-${ indicador.id }` }
                      checked={ selectedIndicadores.includes( indicador.id ) }
                      onCheckedChange={ ( checked ) => handleCheckboxChange( indicador.id, checked ) }
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={ `indicador-${ indicador.id }` }
                        className="text-sm font-medium cursor-pointer block"
                      >
                        { indicador.codigo } - { indicador.nombre }
                      </label>
                      { indicador.descripcion && (
                        <p className="text-xs text-gray-600 mt-1">
                          { indicador.descripcion }
                        </p>
                      ) }
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          { indicador.nivelIndicador }
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          { indicador.tipoIndicador }
                        </span>
                      </div>
                    </div>
                  </div>
                ) ) }
              </div>
            ) }
          </div>

          { selectedIndicadores.length > 0 && (
            <div className="text-sm text-gray-600 mb-4">
              { selectedIndicadores.length } indicador(es) seleccionado(s)
            </div>
          ) }

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                onClick={ () => {
                  setSelectedIndicadores( [] );
                  setFiltro( '' );
                } }
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={ selectedIndicadores.length === 0 }
            >
              Agregar { selectedIndicadores.length > 0 && `(${ selectedIndicadores.length })` }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};