import { BpmnModeler } from '@/components/bpmn/BpmnModeler';
import { DescripcionProceso } from '@/components/procesos/detalle/DescripcionProceso';
import { DocumentosProceso } from '@/components/procesos/detalle/DocumentosProceso';
import { FichaProceso } from '@/components/procesos/detalle/FichaProceso';
import { IndicadoresProceso } from '@/components/procesos/detalle/IndicadoresProceso';
import { ProcedimientoProceso } from '@/components/procesos/detalle/ProcedimientoProceso';
import { TempDatos } from '@/components/procesos/detalle/TempDatos';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { fetchConToken } from '@/helpers/fetch';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const ProcesoPage = () => {

  const { id } = useParams();
  

  const [ detalleProceso, setDetalleProceso ] = useState( null );
  const [ loading, setLoading ] = useState( false );
  const [ ownersList, setOwnersList ] = useState( [] );

  const cargarDetalle = useCallback( async () => {
    
    setLoading( true );
    try {
      const consulta = await fetchConToken( `procesos/detalle/${ id }` ); 
      
      setDetalleProceso( consulta );

      
      const consultaOwners = await fetchConToken( `owners/${ 1 }`, {}, 'GET' );
      
      setOwnersList( consultaOwners.owners );

    } catch ( error ) {
      setDetalleProceso( null );
      console.log( "Error al cargar el detalle del proceso:", error );
    } finally {
      setLoading( false );
    }
  }, [detalleProceso?.mapaId, id] );

  useEffect( () => {
    if ( id ) cargarDetalle();
  }, [ cargarDetalle, id ] );

  if ( loading ) return <div className="p-4">Cargando...</div>;
  if ( !detalleProceso ) return <div className="p-4 text-red-500">No se encontró el detalle del proceso.</div>;

  return (
    <section className="bg-[#90A1B9] p-2">
      <Card className="flex flex-col text-lg  font-bold justify-center items-center h-6 mb-3">
        <h1 className="font-semibold">Detalle del Proceso: <span className="font-bold"> { detalleProceso.proceso.codigo } { detalleProceso.proceso.nombre }</span></h1>
      </Card>
      <Tabs defaultValue="descripcion" className=" flex flex-col ">
        <TabsList className="w-full h-10 bg-gray-200 rounded-t-lg flex items-center justify-around shadow-lg">
          <TabsTrigger value="descripcion">Descripción</TabsTrigger>
          <TabsTrigger value="diagrama">Diagrama</TabsTrigger>
          <TabsTrigger value="ficha">Ficha</TabsTrigger>
          <TabsTrigger value="procedimiento">Procedimiento</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="datos">Datos</TabsTrigger>
        </TabsList>
        <TabsContent value="descripcion" className=" ">
          <DescripcionProceso proceso={ detalleProceso.proceso || [] } ownersOptions={ ownersList || [] } onUpdated={ cargarDetalle } />
        </TabsContent>
        <TabsContent value="diagrama" className="  ">
          {/* <DiagramaProceso proceso={ detalleProceso.proceso || [] } onUpdated={cargarDetalle}/> */ }
          <BpmnModeler xmlInicial={ detalleProceso?.proceso?.diagrama?.xml || undefined } procesoId={ detalleProceso.proceso.id } codigo={ detalleProceso.proceso.codigo } nombre={ detalleProceso.proceso.nombre } />
        </TabsContent>
        <TabsContent value="ficha" className=" ">
          <FichaProceso proceso={ detalleProceso.proceso || [] } />
        </TabsContent>
        <TabsContent value="procedimiento" className=" ">
          <ProcedimientoProceso actividades={ detalleProceso?.proceso?.actividades || [] } idProceso={ detalleProceso.proceso.id || '' } />
        </TabsContent>
        <TabsContent value="indicadores" className=" ">
          <IndicadoresProceso proceso={ detalleProceso || [] } />
        </TabsContent>
        <TabsContent value="documentos" className=" ">
          <DocumentosProceso proceso={ detalleProceso.proceso || [] } />
        </TabsContent>
        <TabsContent value="datos" className="w-full max-w-4xl mx-auto overflow-x-auto ">
          <TempDatos proceso={ detalleProceso.proceso || [] } />


        </TabsContent>
      </Tabs>

    </section>
  );
};
