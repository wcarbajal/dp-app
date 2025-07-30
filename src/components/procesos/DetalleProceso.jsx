import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetchConToken } from '@/helpers/fetch';
import { DescripcionProceso } from './detalle/DescripcionProceso';
import { DiagramaProceso } from './detalle/DiagramaProceso';
import { FichaProceso } from './detalle/FichaProceso';
import { ProcedimientoProceso } from './detalle/ProcedimientoProceso';
import { IndicadoresProceso } from './detalle/IndicadoresProceso';

export const DetalleProceso = ( { procesoId } ) => {
  const [ proceso, setProceso ] = useState( null );
  const [ loading, setLoading ] = useState( true );
  const [ ownersOptions, setOwnersOptions ] = useState( [] );

  const onActualizarDiagrama = async ( file ) => {
    if ( !file ) return null;

    const formData = new FormData();
    formData.append( "diagrama", file );
    
    try {
      const imageResult = await fetchConToken( `procesos/actualizar-diagrama/${ procesoId }`, formData, "POST" );
      return imageResult;
    } catch ( error ) {
      console.error( "Error al actualizar el diagrama:", error );
      return null;
    }
  };

  useEffect( () => {
    const cargarDetalle = async () => {

      console.log( "ID del proceso:", procesoId );
      setLoading( true );
      try {
        // Ajusta la ruta según tu API
        const consulta = await fetchConToken( `procesos/detalle/${ procesoId }` );
        
        setProceso( consulta.proceso );
        
        const consultaOwners = await fetchConToken( "procesos/owners" );
        
         setOwnersOptions( consultaOwners.ownersDb || [] ); 
      } catch ( error ) {
        setProceso( null );
        console.log( "Error al cargar el detalle del proceso:", error );
      } finally {
        setLoading( false );
      }
    };
    if ( procesoId ) cargarDetalle();
  }, [ procesoId ] );

  if ( loading ) return <div className="p-4">Cargando...</div>;
  if ( !proceso ) return <div className="p-4 text-red-500">No se encontró el detalle del proceso.</div>;

  return (
    <div className="flex flex-col gap-4 h-full  ">
      <h2 className="font-bold">{ proceso?.codigo } - { proceso?.nombre }</h2>
      <div className="w-full h-full flex flex-col ">
        <Tabs defaultValue="descripcion" className=" flex flex-col h-full w-full ">
          <TabsList className="w-full h-10 bg-gray-200 rounded-t-lg flex items-center justify-around">
            <TabsTrigger value="descripcion">Descripción</TabsTrigger>
            <TabsTrigger value="diagrama">Diagrama</TabsTrigger>
            <TabsTrigger value="ficha">Ficha</TabsTrigger>
            <TabsTrigger value="procedimiento">Procedimiento</TabsTrigger>
            <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          </TabsList>
          <TabsContent value="descripcion" className="flex-1 w-full h-full ">
            <DescripcionProceso proceso={ proceso } ownersOptions={ ownersOptions } />
          </TabsContent>
          <TabsContent value="diagrama" className=" flex-1 w-full h-full ">
            <DiagramaProceso proceso={ proceso } onActualizarDiagrama={ onActualizarDiagrama } />
          </TabsContent>
          <TabsContent value="ficha" className="flex-1 w-full h-full">
            <FichaProceso proceso={ proceso } />
          </TabsContent>
          <TabsContent value="procedimiento" className="flex-1 w-full h-full">
            <ProcedimientoProceso procedimiento={ proceso.detalleProceso?.procedimiento || [] } />
          </TabsContent>
          <TabsContent value="indicadores" className="flex-1 w-full h-full">
            <IndicadoresProceso proceso={ proceso } />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};