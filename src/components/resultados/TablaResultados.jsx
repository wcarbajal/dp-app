import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Plus, Edit, Trash, } from "tabler-icons-react";
import Swal from "sweetalert2";
import { fetchConToken } from "@/helpers/fetch";

export const TablaResultados = ( {
  resultados, setResultados, indicadorId, setEditingResult, form, accordionValue, setAccordionValue
} ) => {


  // Manejar eliminación de resultado
  const handleDelete = async ( resultadoId ) => {
    const result = await Swal.fire( {
      title: '¿Está seguro?',
      text: "¿Desea eliminar este resultado? Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',

    } );

    if ( result.isConfirmed ) {
      try {
        //setLoading( true );
        const response = await fetchConToken( `resultado/${ resultadoId }`, {}, 'DELETE' );

        if ( response.ok ) {
          await Swal.fire( {
            title: 'Resultado eliminado',
            text: 'El resultado ha sido eliminado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2A2A2A'
          } );

          // Recargar resultados
          const resultadosResponse = await fetchConToken( `indicador/resultados/${ indicadorId }`, {}, 'GET' );

          console.log( "resultao despues de eliminar", resultadosResponse );

          if ( resultadosResponse.ok ) {
            setResultados( resultadosResponse.resultados || [] );
          }
        } else {
          throw new Error( response.msg || 'Error al eliminar el resultado' );
        }
      } catch ( error ) {
        await Swal.fire( {
          title: 'Error',
          text: error.message || 'Error al eliminar el resultado',
          icon: 'error',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'Aceptar',
        } );
      } finally {
        //setLoading( false );
      }
    }
  };

  // Manejar edición de resultado
  const handleEdit = ( resultado ) => {
    console.log('handleEdit - Iniciando edición de resultado:', resultado.id);
    console.log('handleEdit - accordionValue actual:', accordionValue);
    
    setEditingResult( resultado );

    // Validar y formatear la fecha de registro
    let fechaFormateada = new Date().toISOString().split( 'T' )[ 0 ]; // fecha por defecto hoy

    if ( resultado.fechaRegistro ) {
      try {
        const fecha = new Date( resultado.fechaRegistro );
        if ( !isNaN( fecha.getTime() ) ) {
          fechaFormateada = fecha.toISOString().split( 'T' )[ 0 ];
        }
      } catch ( error ) {
        console.warn( 'Error al parsear fechaRegistro:', error );
      }
    }

    form.reset( {
      denominacion: resultado.denominacion || "",
      descripcion: resultado.descripcion || "",
      valor: resultado.valor.toString(),
      fechaRegistro: fechaFormateada,
    } );

    // Abrir el accordion primero
    console.log('handleEdit - Intentando abrir accordion con valor: formulario-resultado');
    setAccordionValue( "formulario-resultado" );
    
    console.log('handleEdit - setAccordionValue ejecutado');

    // Dar tiempo para que se abra el accordion y luego hacer scroll
    setTimeout( () => {
      const elemento = document.getElementById( 'formulario-resultado' );
      console.log('handleEdit - Elemento formulario-resultado encontrado:', !!elemento);
      
      if ( elemento ) {
        elemento.scrollIntoView( {
          behavior: 'smooth',
          block: 'start'
        } );

        // Scroll adicional hacia abajo después de un momento
        setTimeout( () => {
          window.scrollBy( {
            top: 120,
            behavior: 'smooth'
          } );
        }, 500 );
      }
    }, 500 ); // Aumenté el tiempo para dar más margen a la animación
  };

  return (
    <Card className=" w-full mt-0">
      <CardHeader>
        <CardTitle>Resultados Registrados</CardTitle>
        <CardDescription>
          Lista de todos los resultados registrados para este indicador
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="bg-gray-300">Denominación</TableHead>
                <TableHead className="bg-gray-300">Valor</TableHead>
                <TableHead className="bg-gray-300">Fecha Registro</TableHead>
                <TableHead className="bg-gray-300">Descripción</TableHead>
                <TableHead className="text-center bg-gray-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { resultados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={ 5 } className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Plus size={ 48 } className="text-gray-300" />
                      <span className="text-lg">Sin resultados registrados</span>
                      <span className="text-sm">
                        No se han agregado resultados para este indicador
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                resultados.map( ( resultado ) => (
                  <TableRow key={ resultado.id }>
                    <TableCell className="font-medium">
                      { resultado.denominacion || "Sin denominación" }
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-blue-600 font-semibold">
                        { typeof resultado.valor === 'number'
                          ? resultado.valor.toLocaleString( 'es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          } )
                          : resultado.valor
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      { ( () => {
                        if ( !resultado.fechaRegistro ) return 'Fecha no disponible';
                        try {
                          const fecha = new Date( resultado.fechaRegistro );
                          if ( isNaN( fecha.getTime() ) ) return 'Fecha inválida';
                          return fecha.toLocaleDateString( 'es-PE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          } );
                        } catch {
                          return 'Fecha inválida';
                        }
                      } )() }
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={ resultado.descripcion }>
                        { resultado.descripcion || "Sin descripción" }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={ () => handleEdit( resultado ) }
                              className="h-8 w-8 p-0"
                            >
                              <Edit size={ 14 } />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar resultado</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={ () => handleDelete( resultado.id ) }
                              className="h-8 w-8 p-0"
                            // disabled={ loading }
                            >
                              <Trash size={ 14 } />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar resultado</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ) )
              ) }
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};