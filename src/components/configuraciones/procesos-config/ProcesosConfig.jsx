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

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
      parentId: undefined,
    },
  } );

  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );
  const [ loading, setLoading ] = useState( true );
  const [ procesosSeleccionado, setProcesosSeleccionado ] = useState( [] );

  //const [ procesos, setProcesos ] = useState( [] );
  const [ tipoFiltro, setTipoFiltro ] = useState( "" );
  const [ openDialog, setOpenDialog ] = useState( false );
  const [ editId, setEditId ] = useState( null );




  // Agregar o modificar proceso
  const handleSubmit = async ( values, editId ) => {
    //e.preventDefault();
    console.log("inico del hansubmit")
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
        setProcesosSeleccionado( respuesta.procesos );
      } else {
        setProcesosSeleccionado( [] );
      }
    } catch ( error ) {
      setProcesosSeleccionado( [] );
      console.error( "Error al cargar procesos asociados:", error );
    }
  }, [ mapaSeleccionado ] );

  useEffect( () => {

    cargarProcesos();
  }, [ cargarProcesos ] );

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

                <NuevoEditarProcesoConfig
                  openDialog={ openDialog }
                  setOpenDialog={ setOpenDialog }
                  form={ form }
                  handleSubmit={ handleSubmit }
                  procesos={ procesosSeleccionado }
                  editId={ editId }
                  setEditId={ setEditId }
                />
              </div>

              <FiltroProcesoConfig tipoFiltro={ tipoFiltro } setTipoFiltro={ setTipoFiltro } />

              <div className="space-y-2  ">
                { procesosSeleccionado.length === 0
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