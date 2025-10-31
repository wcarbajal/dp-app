import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetchConToken } from '@/helpers/fetch';
import { DescripcionProceso } from './detalle/DescripcionProceso';
import { DiagramaProceso } from './detalle/DiagramaProceso';
import { FichaProceso } from './detalle/FichaProceso';
import { ProcedimientoProceso } from './detalle/ProcedimientoProceso';
import { IndicadoresProceso } from './detalle/indicadores-proceso/IndicadoresProceso';
import { DocumentosProceso } from './detalle/DocumentosProceso';
import { TempDatos } from './detalle/TempDatos';

import { BpmnModeler } from '../bpmn/BpmnModeler';

/* No activo */

export const DetalleProceso = ( { procesoId } ) => {

  const [ detalleProceso, setDetalleProceso ] = useState( null );
  const [ loading, setLoading ] = useState( false );
  const [ ownersList, setOwnersList ] = useState( [] );



  const cargarDetalle = useCallback( async () => {
    setLoading( true );

    try {
      const consulta = await fetchConToken( `procesos/detalle/${ procesoId }` );


      setDetalleProceso( consulta );
      
      const consultaOwners = await fetchConToken( "owners" );
      setOwnersList( consultaOwners.owners );

    } catch ( error ) {
      setDetalleProceso( null );
      console.log( "Error al cargar el detalle del proceso:", error );
    } finally {
      setLoading( false );
    }
  }, [ procesoId ] );

  useEffect( () => {
    if ( procesoId ) cargarDetalle();

  }, [ cargarDetalle, procesoId ] );

  if ( loading ) return <div className="p-4">Cargando...</div>;
  if ( !detalleProceso ) return <div className="p-4 text-red-500">No se encontró el detalle del proceso.</div>;

  console.log({detalleProceso})

  return (

    <Tabs defaultValue="descripcion" className=" flex flex-col ">
      <TabsList className="w-full h-10 bg-gray-200 rounded-t-lg flex items-center justify-around">
        <TabsTrigger value="descripcion">Descripción XX</TabsTrigger>
        <TabsTrigger value="diagrama">Diagrama</TabsTrigger>
        <TabsTrigger value="ficha">Ficha</TabsTrigger>
        <TabsTrigger value="procedimiento">Procedimiento</TabsTrigger>
        <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="datos">Datos</TabsTrigger>
        <TabsTrigger value="analisis">Análisis</TabsTrigger>
      </TabsList>
      <TabsContent value="descripcion" className=" ">
        <DescripcionProceso proceso={ detalleProceso.proceso || [] } ownersOptions={ ownersList || [] } onUpdated={ cargarDetalle } />
      </TabsContent>
      <TabsContent value="diagrama" className="  ">       
        <BpmnModeler xmlInicial={ detalleProceso?.proceso?.diagrama?.xml || undefined } procesoId={ detalleProceso.proceso.id } codigo={ detalleProceso.proceso.codigo } nombre={ detalleProceso.proceso.nombre } />
      </TabsContent>
      <TabsContent value="ficha" className=" ">
        <FichaProceso proceso={ detalleProceso.proceso || [] } />
      </TabsContent>
      <TabsContent value="procedimiento" className=" ">
        <ProcedimientoProceso actividades={ detalleProceso?.proceso?.actividades || [] } idProceso={ detalleProceso.proceso.id || '' } />
      </TabsContent>
      <TabsContent value="indicadores" className=" ">
        <IndicadoresProceso procesos={ detalleProceso.proceso || [] } indicadores={ detalleProceso.indicadores || [] } />
      </TabsContent>
      <TabsContent value="documentos" className=" ">
        <DocumentosProceso proceso={ detalleProceso.proceso || [] } />
      </TabsContent>
      <TabsContent value="datos" className="w-full max-w-4xl mx-auto overflow-x-auto ">
        <TempDatos proceso={ detalleProceso.proceso || [] } />
      </TabsContent>
      <TabsContent value="analisis" className="w-full max-w-4xl mx-auto overflow-x-auto ">
        <AnalizadorProcesos proceso={ detalleProceso.proceso || [] } />
      </TabsContent>
    </Tabs>


  );
};