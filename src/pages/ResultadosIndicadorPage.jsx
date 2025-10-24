import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, Plus, Edit, Trash, Briefcase, Refresh } from "tabler-icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchConToken } from "@/helpers/fetch";
import Swal from "sweetalert2";

// Schema de validación con Zod
const resultadoSchema = z.object( {
  denominacion: z.string().optional(),
  descripcion: z.string().optional(),
  valor: z
    .string()
    .min( 1, "El valor es requerido" )
    .transform( ( val ) => parseFloat( val ) )
    .refine( ( val ) => !isNaN( val ), "Debe ser un número válido" ),
  fechaRegistro: z.string().min( 1, "La fecha de registro es requerida" ),
} );

export const ResultadosIndicadorPage = () => {
  const { indicadorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { from, indicador: indicadorFromState, procesoId } = location.state || {};

  const [ indicador, setIndicador ] = useState( indicadorFromState || null );
  const [ resultados, setResultados ] = useState( [] );
  const [ editingResult, setEditingResult ] = useState( null );
  const [ loading, setLoading ] = useState( false );
  const [ accordionValue, setAccordionValue ] = useState( "formulario-resultado" );

  const form = useForm( {
    resolver: zodResolver( resultadoSchema ),
    defaultValues: {
      denominacion: "",
      descripcion: "",
      valor: "",
      fechaRegistro: new Date().toISOString().split( 'T' )[ 0 ],
    },
  } );

  // Cargar datos del indicador y resultados
  useEffect( () => {
    const cargarDatos = async () => {
      setLoading( true );
      try {
        // Si no tenemos el indicador del state, lo cargamos
        if ( !indicador ) {
          const indicadorResponse = await fetchConToken( `indicador/${ indicadorId }`, {}, 'GET' );
          if ( indicadorResponse.ok ) {
            setIndicador( indicadorResponse.indicador );
          }
        }

        // Cargar resultados
        const resultadosResponse = await fetchConToken( `indicador/resultados/${ indicadorId }`, {}, 'GET' );

        console.log("resultadosResponse", resultadosResponse);
        
        if ( resultadosResponse.ok ) {
          setResultados( resultadosResponse.resultados || [] );
        }
      } catch ( error ) {
        console.error( "Error al cargar datos:", error );
        await Swal.fire( {
          title: 'Error',
          text: 'Error al cargar los datos del indicador',
          icon: 'error',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'Aceptar',
        } );
      } finally {
        setLoading( false );
      }
    };

    if ( indicadorId ) {
      cargarDatos();
    }
  }, [ indicadorId, indicador ] );

  // Manejar guardado de resultado
  const handleSave = async ( data ) => {
    try {
      setLoading( true );
      const resultadoData = {
        ...data,
        indicadorId: parseInt( indicadorId ),
        ...( editingResult && { id: editingResult.id } ),
      };

      const method = editingResult ? 'PUT' : 'POST';
      const endpoint = editingResult
        ? `resultado/${ editingResult.id }`
        : 'resultado';

      const response = await fetchConToken( endpoint, resultadoData, method );

      if ( response.ok ) {
        await Swal.fire( {
          title: 'Éxito',
          text: editingResult
            ? 'Resultado actualizado correctamente'
            : 'Resultado creado correctamente',
          icon: 'success',
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Aceptar',
        } );

        // Recargar resultados
        const resultadosResponse = await fetchConToken( `indicador/${ indicadorId }/resultados`, {}, 'GET' );
        if ( resultadosResponse.ok ) {
          setResultados( resultadosResponse.resultados || [] );
        }

        // Limpiar formulario
        form.reset( {
          denominacion: "",
          descripcion: "",
          valor: "",
          fechaRegistro: new Date().toISOString().split( 'T' )[ 0 ],
        } );
        setEditingResult( null );
      } else {
        throw new Error( response.msg || 'Error al guardar el resultado' );
      }
    } catch ( error ) {
      await Swal.fire( {
        title: 'Error',
        text: error.message || 'Error al guardar el resultado',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Aceptar',
      } );
    } finally {
      setLoading( false );
    }
  };

  // Manejar edición de resultado
  const handleEdit = ( resultado ) => {
    setEditingResult( resultado );
    form.reset( {
      denominacion: resultado.denominacion || "",
      descripcion: resultado.descripcion || "",
      valor: resultado.valor.toString(),
      fechaRegistro: new Date( resultado.fechaRegistro ).toISOString().split( 'T' )[ 0 ],
    } );

    // Abrir accordion y hacer scroll al formulario
    setAccordionValue( "formulario-resultado" );
    setTimeout(() => {
      document.getElementById( 'formulario-resultado' )?.scrollIntoView( {
        behavior: 'smooth'
      } );
    }, 100);
  };

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
      cancelButtonText: 'Cancelar'
    } );

    if ( result.isConfirmed ) {
      try {
        setLoading( true );
        const response = await fetchConToken( `resultado/${ resultadoId }`, {}, 'DELETE' );

        if ( response.ok ) {
          await Swal.fire( {
            title: 'Resultado eliminado',
            text: 'El resultado ha sido eliminado correctamente',
            icon: 'success',
            confirmButtonColor: '#2A2A2A',
            confirmButtonText: 'Aceptar',
          } );

          // Recargar resultados
          const resultadosResponse = await fetchConToken( `indicador/${ indicadorId }/resultados`, {}, 'GET' );
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
        setLoading( false );
      }
    }
  };

  // Manejar navegación de regreso
  const handleGoBack = () => {
    if ( from === 'proceso' && procesoId ) {
      navigate( `/proceso/${ procesoId }` );
    } else {
      navigate( -1 );
    }
  };

  // Limpiar formulario
  const handleClearForm = () => {
    form.reset( {
      denominacion: "",
      descripcion: "",
      valor: "",
      fechaRegistro: new Date().toISOString().split( 'T' )[ 0 ],
    } );
    setEditingResult( null );
  };

  if ( loading && !indicador ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl ">
      {/* Header */ }
      <div className="flex items-center gap-4 ">
        <Button
          variant="outline"
          onClick={ handleGoBack }
          className="flex items-center gap-2"
        >
          <ArrowLeft size={ 16 } />
          Volver
        </Button>
        <div>
          <h1 className="text-xl font-bold">Gestión de Resultados</h1>
          <p className="text-muted-foreground">
            Gestionar resultados del indicador: { indicador?.codigo } - { indicador?.nombre }
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center  gap-5">

        {/* Tabla de resultados */ }
        <Card className="mt-6">
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
                          { new Date( resultado.fechaRegistro ).toLocaleDateString( 'es-PE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          } ) }
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
                                  disabled={ loading }
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

      {/*   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}

        {/* Formulario en Accordion */}
        <Accordion 
          type="single" 
          collapsible   
          className="w-full mt-0 bg-white p-3 rounded-lg shadow"
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          <AccordionItem value="formulario-resultado" id="formulario-resultado">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Plus size={20} />
                {editingResult ? "Editar Resultado" : "Nuevo Resultado"}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="text-sm text-muted-foreground mb-4">
                {editingResult 
                  ? "Modificar los datos del resultado seleccionado"
                  : "Agregar un nuevo resultado para el indicador"}
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Denominación */ }
                    <FormField
                      control={ form.control }
                      name="denominacion"
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormLabel>Denominación</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingrese la denominación del resultado"
                              { ...field }
                            />
                          </FormControl>
                          <FormDescription>
                            Nombre o título descriptivo (opcional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />

                    {/* Valor */ }
                    <FormField
                      control={ form.control }
                      name="valor"
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormLabel>Valor *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              { ...field }
                            />
                          </FormControl>
                          <FormDescription>
                            Valor numérico del resultado
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </div>

                  {/* Fecha de registro */ }
                  <FormField
                    control={ form.control }
                    name="fechaRegistro"
                    render={ ( { field } ) => (
                      <FormItem>
                        <FormLabel>Fecha de Registro *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            { ...field }
                          />
                        </FormControl>
                        <FormDescription>
                          Fecha en la que se registra el resultado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    ) }
                  />

                  {/* Descripción */ }
                  <FormField
                    control={ form.control }
                    name="descripcion"
                    render={ ( { field } ) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción detallada del resultado..."
                            className="min-h-[100px]"
                            { ...field }
                          />
                        </FormControl>
                        <FormDescription>
                          Descripción detallada (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    ) }
                  />

                  {/* Botones */ }
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={ loading }
                    >
                      <Briefcase size={ 16 } />
                      { loading ? "Guardando..." : ( editingResult ? "Actualizar" : "Guardar" ) } Resultado
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={ handleClearForm }
                      className="flex items-center gap-2"
                    >
                      <Refresh size={ 16 } />
                      Limpiar
                    </Button>
                  </div>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

          {/* Información del indicador */ }
          {/*  <Card>
          <CardHeader>
            <CardTitle>Información del Indicador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold">Código:</span> { indicador?.codigo }
            </div>
            <div>
              <span className="font-semibold">Nombre:</span> { indicador?.nombre }
            </div>
            <div>
              <span className="font-semibold">Descripción:</span> { indicador?.descripcion }
            </div>
            { indicador?.formula && (
              <div>
                <span className="font-semibold">Fórmula:</span>
                <math-field
                  read-only
                  value={ indicador.formula }
                  style={ {
                    display: 'inline-block',
                    marginLeft: '8px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '16px'
                  } }
                />
              </div>
            ) }
            <div>
              <span className="font-semibold">Frecuencia:</span> { indicador?.frecuencia }
            </div>
            <div>
              <span className="font-semibold">Fuente de Datos:</span> { indicador?.fuenteDatos }
            </div>
          </CardContent>
        </Card> */}
     {/*    </div> */}
      </div>
    </div>
  );
};