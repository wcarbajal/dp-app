import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { fetchConToken } from "@/helpers/fetch";
import { nuevoProcesoSchema } from '@/schema/ProcesosSchema';
import { getProcesosTree, renderProcesoTreeVertical } from '@/utils/procesos';
import { NuevoEditarProcesoConfig } from './NuevoEditarProcesoConfig';
import { FiltroProcesoConfig } from './FiltroProcesoConfig';
import { ListaMapas } from '@/components/ListaMapas';
import { cargarMapas } from "@/helpers/mapas";
import { BotonRegresar } from '@/components/propios/BotonRegresar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MdOutlineExposurePlus1 } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';



export const ProcesosConfig = () => {

  

  const form = useForm( {
    resolver: zodResolver( nuevoProcesoSchema ),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      nivel: "",
      tipo: "",
      idMapa: undefined,
      parentId: '',

    },
  } );

  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );
  const [ loading, setLoading ] = useState( true );
  const [ procesosSeleccionado, setProcesosSeleccionado ] = useState( [] );
  const [ procesos, setProcesos ] = useState( [] );


  const [ tipoFiltro, setTipoFiltro ] = useState( "" );
  const [ openDialog, setOpenDialog ] = useState( false );
  const [ editId, setEditId ] = useState( null );

  useEffect( () => {
    const obtenerMapas = async () => {
      setLoading( true );
      const mapas = await cargarMapas();
      setMapas( mapas );
      setLoading( false );
    };
    obtenerMapas();
  }, [ mapaSeleccionado ] );

  const cargarProcesos = useCallback( async () => {
    if ( !mapaSeleccionado ) return;
    try {
      const respuesta = await fetchConToken( `mapa/${ mapaSeleccionado.id }/procesos-lista` );
      if ( respuesta.ok ) {
        setProcesos( respuesta.procesos );
      } else {
        setProcesos( [] );
      }
    } catch ( error ) {
      setProcesos( [] );
      console.error( "Error al cargar procesos asociados:", error );
    }
  }, [ mapaSeleccionado ] );

  useEffect( () => {

    cargarProcesos();
  }, [ cargarProcesos ] );

  // Agregar o modificar proceso
  const handleSubmit = async ( values ) => {
    //e.preventDefault();
    console.log( "inico del hansubmit" );
    console.log( {values} );
     try {
       let respuesta;
 
       if ( editId ) {
         respuesta = await fetchConToken( `procesos/${ editId }`, values, "PUT" );
       } else {
         respuesta = await fetchConToken( "procesos/registrar", values, "POST" );
       }
       if ( respuesta.ok ) {
 
         cargarProcesos();
         setOpenDialog( false );
         setEditId( null );
         form.reset();
       } else {
 
         alert( "Error al guardar el proceso" );
       }
     } catch ( error ) {
       console.error( "Error al guardar proceso:", error );
     }
  };

  // Eliminar proceso
  const handleEliminar = async ( id ) => {
    if ( !window.confirm( "¿Eliminar este proceso?" ) ) return;
    try {
      const respuesta = await fetchConToken( `procesos/${ id }`, {}, "DELETE" );
      if ( respuesta.ok ) cargarProcesos();
      else alert( "Error al eliminar el proceso" );
    } catch ( error ) {
      console.error( "Error al eliminar proceso:", error );
    }
  };

  // Abrir diálogo para editar
  const handleEditar = ( proceso ) => {
    form.setValue( "codigo", proceso.codigo );
    form.setValue( "nombre", proceso.nombre );
    form.setValue( "descripcion", proceso.descripcion || "" );
    form.setValue( "nivel", proceso.nivel.toString() );
    form.setValue( "tipo", proceso.tipo );
    form.setValue( "parentId", proceso.parentId || undefined );

    setEditId( proceso.id );
    setOpenDialog( true );
  };


console.log("Errores de validación:", form.formState.errors);

  return (


    <div className=" flex flex-col gap-4  items-center">
      <BotonRegresar url="/config" nombre="Configuración" />
      { loading
        ? ( <div className="text-center text-gray-500">Cargando mapas...</div> )
        : (
          <>
            <ListaMapas mapas={ mapas || [] } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />

            <div className="max-w-xl mx-auto my-0 p-4 border  rounded-2xl min-w-[700px] shadow-xl bg-white">


              <div className="flex justify-between items-center mb-4 ">

                <h2 className="font-bold text-lg w-45">Listado de Procesos </h2>

                <Dialog open={ openDialog } onOpenChange={ setOpenDialog }>
                  <DialogTrigger asChild>
                    <Button onClick={ () => {
                      form.setValue( "codigo", "" );
                      form.setValue( "nombre", "" );
                      form.setValue( "descripcion", "" );
                      form.setValue( "nivel", "" );
                      form.setValue( "tipo", "" );
                      form.setValue( "parentId", undefined );
                      form.setValue( "idMapa", mapaSeleccionado ? mapaSeleccionado.id : undefined );
                      setOpenDialog( true );
                      setEditId( null );
                    } }
                    >
                      <MdOutlineExposurePlus1 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby="dialog-description">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-boldt text-center">{ editId ? "Editar Proceso" : "Nuevo Proceso" }</DialogTitle>
                      <DialogDescription id="dialog-description">
                        Complete los datos para crear o editar un proceso.
                      </DialogDescription>
                    </DialogHeader>

                    <Form { ...form }>
                      <form onSubmit={ form.handleSubmit( handleSubmit ) } className="space-y-8">
                        <FormField
                          control={ form.control }
                          name="tipo"
                          render={ ( { field } ) => (
                            <FormItem className="mb-4">
                              <FormLabel >Tipo de proceso</FormLabel>
                              <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                <FormControl className="w-full">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Estratégico">Estratégico</SelectItem>
                                  <SelectItem value="Misional">Misional</SelectItem>
                                  <SelectItem value="Soporte">Soporte</SelectItem>
                                </SelectContent>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                        <div className="grid grid-cols-3 gap-4 m-0">
                          <FormField
                            control={ form.control }
                            name="codigo"
                            render={ ( { field } ) => (
                              <FormItem className="mb-4 col-span-2">
                                <FormLabel>Código</FormLabel>
                                <FormControl>
                                  <Input placeholder="Código del proceso" { ...field } />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            ) }
                          />
                          <FormField
                            control={ form.control }
                            name="nivel"
                            render={ ( { field } ) => (
                              <FormItem className="mb-4">
                                <FormLabel >Nivel de proceso</FormLabel>
                                <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                  <FormControl className="w-full">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccione un nivel" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="0">0</SelectItem>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="6">6</SelectItem>
                                    <SelectItem value="7">7</SelectItem>
                                    <SelectItem value="8">8</SelectItem>
                                    <SelectItem value="9">9</SelectItem>
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            ) }
                          />

                        </div>
                        <FormField
                          control={ form.control }
                          name="nombre"
                          render={ ( { field } ) => (
                            <FormItem className="mb-4">
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre del proceso" { ...field } />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />


                        <FormField
                          control={ form.control }
                          name="descripcion"
                          render={ ( { field } ) => (
                            <FormItem className="mb-4">
                              <FormLabel>Descripción</FormLabel>
                              <FormControl>
                                <Input placeholder="Descripción del proceso" { ...field } />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />

                        <FormField
                          control={ form.control }
                          name="parentId"
                          render={ ( { field } ) => (
                            <FormItem className="mb-4">
                              <FormLabel >Proceso padre (opcional)</FormLabel>
                              <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                <FormControl className="w-full">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {
                                    procesos && procesos.length > 0 &&
                                    [ ...procesos ]
                                      .sort( ( a, b ) => a.codigo.localeCompare( b.codigo ) )
                                      .map( proceso => (
                                        <SelectItem key={ proceso.id } value={ proceso.id.toString() }>
                                          { proceso.codigo } - { proceso.nombre }
                                        </SelectItem>
                                      ) )
                                  }
                                </SelectContent>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                        { Object.values( form.formState.errors ).length > 0 && (
                          <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2">
                            <ul className="list-disc pl-5">
                              { Object.entries( form.formState.errors ).map( ( [ key, error ] ) => (
                                <li key={ key }>{ error.message }</li>
                              ) ) }
                            </ul>
                          </div>
                        ) }
                        <Button type="submit" className="flex justify-self-end ">{ editId ? "Actualizar Proceso" : "Registrar Proceso" }</Button>
                      </form>
                    </Form>

                  </DialogContent>
                </Dialog>

              </div>

              <FiltroProcesoConfig tipoFiltro={ tipoFiltro } setTipoFiltro={ setTipoFiltro } />

              <div className="space-y-2  ">
                { procesosSeleccionado?.length === 0
                  ? <span className="text-muted-foreground text-sm ">No hay procesos registrados</span>
                  : getProcesosTree( procesosSeleccionado, tipoFiltro ).map(

                    proceso => renderProcesoTreeVertical( proceso, handleEditar, handleEliminar, true )
                  )
                }

              </div>
            </div>
          </>
        )
      }

    </div>
  );
};