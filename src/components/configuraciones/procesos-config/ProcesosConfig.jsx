import { useState, useEffect, useCallback } from "react";
import { fetchConToken } from "@/helpers/fetch";
import { getProcesosTree, renderProcesoTreeVertical } from '@/utils/procesos';
import { CreateEditProceso } from './CrearEditarProceso';
import { FiltroProcesoConfig } from './FiltroProcesoConfig';
import { ListaMapas } from '@/components/ListaMapas';
import { cargarMapas } from "@/helpers/mapas";
import { BotonRegresar } from '@/components/propios/BotonRegresar';



export const ProcesosConfig = () => {

  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );
  const [ loading, setLoading ] = useState( true );
  const [ listadoProcesos, setListadoProcesos ] = useState( [] );
  


  const [ tipoFiltro, setTipoFiltro ] = useState( "" );
  


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
        setListadoProcesos( respuesta.procesos );
      } else {
        setListadoProcesos( [] );
      }
    } catch ( error ) {
      setListadoProcesos( [] );
      console.error( "Error al cargar procesos asociados:", error );
    }
  }, [ mapaSeleccionado ] );

  useEffect( () => {

    cargarProcesos();
  }, [ cargarProcesos ] );

  // Agregar o modificar proceso
  /*   const handleSubmit = async ( values ) => {
      //e.preventDefault();
      console.log( "inico del hansubmit" );
      console.log( { values } );
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
    }; */

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

                <CreateEditProceso 
                   idMapa={ mapaSeleccionado?.id } 
                   listadoProcesos={ listadoProcesos }
                   proceso={ null } 
                    cargarProcesos={ cargarProcesos }  />

              </div>

              <FiltroProcesoConfig tipoFiltro={ tipoFiltro } setTipoFiltro={ setTipoFiltro } />

              <div className="space-y-2  ">
                { listadoProcesos?.length === 0
                  ? <span className="text-muted-foreground text-sm ">No hay procesos registrados</span>
                  : getProcesosTree( listadoProcesos, tipoFiltro ).map(

                    proceso => renderProcesoTreeVertical( proceso, handleEliminar, listadoProcesos, cargarProcesos )
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