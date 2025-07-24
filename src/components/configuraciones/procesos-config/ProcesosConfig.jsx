import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { fetchConToken } from "@/helpers/fetch";

import { nuevoProcesoSchema } from '@/schema/SchemaProcesos';
import { getProcesosTree, renderProcesoTreeVertical } from '@/utils/procesos';
import { DialogProcesoConfig } from './DialogProcesoConfig';
import { FiltroProcesoConfig } from './FiltroProcesoConfig';

export const ProcesosConfig = () => {

  const form = useForm( {
    resolver: zodResolver( nuevoProcesoSchema ),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      nivel: "",
      tipo: "",
      parentId: undefined,
    },
  } );


  const [ procesos, setProcesos ] = useState( [] );
  const [ tipoFiltro, setTipoFiltro ] = useState( "" );
  const [ openDialog, setOpenDialog ] = useState( false );
  const [ editId, setEditId ] = useState( null );


  const cargarProcesos = async () => {
    try {
      const data = await fetchConToken( "procesos" );
      setProcesos( data.procesos || [] );
    } catch ( error ) {
      console.error( "Error al cargar procesos:", error );
    }
  };

  useEffect( () => {
    cargarProcesos();
  }, [] );

  // Agregar o modificar proceso
  const handleSubmit = async ( values ) => {
    //e.preventDefault();
    try {
      let respuesta;
      console.log( "Valores del formulario:", values );
      if ( editId ) {
        respuesta = await fetchConToken( `procesos/${ editId }`, values, "PUT" );
      } else {
        respuesta = await fetchConToken( "procesos/registrar", values, "POST" );
      }
      if ( respuesta.ok ) {
        console.log( "respuesta", respuesta );
        cargarProcesos();
        setOpenDialog( false );
        setEditId( null );
        form.reset();
      } else {
        console.log( "respuesta", respuesta );
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

  return (
    <div className="max-w-xl mx-auto my-5 p-4 border rounded-2xl bg-white shadow-xl">
      <div className="flex justify-between items-center mb-4 ">

        <h2 className="font-bold text-lg w-45">Procesos</h2>

        <DialogProcesoConfig
          openDialog={ openDialog }
          setOpenDialog={ setOpenDialog }
          form={ form }
          handleSubmit={ handleSubmit }
          procesos={ procesos }
          editId={ editId }
          setEditId={ setEditId }
        />
      </div>
      
      <FiltroProcesoConfig  tipoFiltro={ tipoFiltro } setTipoFiltro={ setTipoFiltro } />

      <div className="space-y-2">
        { procesos.length === 0
          ? <span className="text-muted-foreground text-sm ">No hay procesos registrados</span>
          : getProcesosTree( procesos, tipoFiltro ).map( proceso => renderProcesoTreeVertical( proceso, handleEditar, handleEliminar, true ) )
        }

      </div>
    </div>
  );
};