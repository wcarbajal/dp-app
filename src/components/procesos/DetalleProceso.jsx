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

  const onActualizarDiagrama = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append("diagrama", file);
    console.log("formData", formData);
    try {
     const imageResult = await fetchConToken(`procesos/actualizar-diagrama/${procesoId}`, formData, "POST");
      return imageResult;
    } catch (error) {
      console.error("Error al actualizar el diagrama:", error);
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
        console.log( "Detalle del proceso:", consulta.proceso );
        setProceso( consulta.proceso );
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
    <div className="flex flex-col gap-4 h-full ">
      <h2 className="font-bold mb-2">{ proceso?.codigo } - { proceso?.nombre }</h2>
      <div className="w-full h-full flex flex-col ">
        <Tabs defaultValue="descripcion" className="w-full h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="descripcion">Descripción</TabsTrigger>
            <TabsTrigger value="diagrama">Diagrama</TabsTrigger>
            <TabsTrigger value="ficha">Ficha</TabsTrigger>
            <TabsTrigger value="procedimiento">Procedimiento</TabsTrigger>
            <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          </TabsList>
          <TabsContent value="descripcion" className="w-full h-full p-4 ">
            <DescripcionProceso proceso={ proceso } />
          </TabsContent>
          <TabsContent value="diagrama" className="flex-1 w-full h-full p-4">
            <DiagramaProceso proceso={ proceso } onActualizarDiagrama={ onActualizarDiagrama } />
          </TabsContent>
          <TabsContent value="ficha" className="flex-1 w-full h-full p-4">
            <FichaProceso proceso={ proceso } />
          </TabsContent>
          <TabsContent value="procedimiento" className="flex-1 w-full h-full p-4">
            <ProcedimientoProceso proceso={ proceso } />
          </TabsContent>
          <TabsContent value="indicadores" className="flex-1 w-full h-full p-4">
            <IndicadoresProceso proceso={ proceso } />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};