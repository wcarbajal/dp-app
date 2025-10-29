import { BpmnModeler } from '@/components/bpmn/BpmnModeler';
import { DescripcionProceso } from '@/components/procesos/detalle/DescripcionProceso';
import { DocumentosProceso } from '@/components/procesos/detalle/DocumentosProceso';
import { FichaProceso } from '@/components/procesos/detalle/FichaProceso';
import { IndicadoresProceso } from '@/components/procesos/detalle/indicadores-proceso/IndicadoresProceso';
import { ProcedimientoProceso } from '@/components/procesos/detalle/ProcedimientoProceso';
import { TempDatos } from '@/components/procesos/detalle/TempDatos';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { fetchConToken } from '@/helpers/fetch';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';

export const ProcesoPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [proceso, setProceso] = useState(null);
  const [indicadoresList, setIndicadoresList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ownersList, setOwnersList] = useState([]);
  const [activeTab, setActiveTab] = useState('descripcion');

  

  // Cargar proceso principal
  const cargarProceso = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const detalleProcesos = await fetchConToken(`procesos/detalle/${id}`);
      
      if (detalleProcesos.ok) {
        setProceso(detalleProcesos.proceso);
      } else {
        setProceso(null);
      }
    } catch (error) {
      setProceso(null);
      console.error("Error al cargar el detalle del proceso:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Cargar indicadores (solo cuando hay mapaId)
  const cargarIndicadores = useCallback(async (mapaId) => {
    if (!mapaId) return;
    
    try {
      const consultaIndicadores = await fetchConToken(`indicador/${mapaId}`, {}, 'GET');
      if (consultaIndicadores.ok) {
        setIndicadoresList(consultaIndicadores.indicadores);
      }
    } catch (error) {
      setIndicadoresList([]);
      console.error("Error al cargar indicadores:", error);
    }
  }, []);

  // Cargar owners (solo cuando hay mapaId)
  const cargarOwners = useCallback(async (mapaId) => {
    if (!mapaId) return;
    
    try {
      const consultaOwners = await fetchConToken(`owners/${mapaId}`, {}, 'GET');
      if (consultaOwners.ok) {
        setOwnersList(consultaOwners.owners);
      }
    } catch (error) {
      setOwnersList([]);
      console.error("Error al cargar owners:", error);
    }
  }, []);

  // Función para actualizar el diagrama en el estado local
  const handleDiagramaActualizado = (nuevoDiagrama) => {
        
    setProceso(procesoAnterior => {
      if (!procesoAnterior) return procesoAnterior;
      
      return {
        ...procesoAnterior,
        diagrama: {
          ...procesoAnterior.diagrama,
          xml: nuevoDiagrama.xml,
          imagen: nuevoDiagrama.imagen,
          url: nuevoDiagrama.url,
          metadatos: nuevoDiagrama.metadatos,
          fechaActualizacion: new Date().toISOString()
        }
      };
    });
  };

  // Cargar proceso inicial
  useEffect(() => {
    cargarProceso();
  }, [cargarProceso]);

  // Cargar datos dependientes cuando cambie el mapaId
  useEffect(() => {
    if (proceso?.mapaId) {
      cargarIndicadores(proceso.mapaId);
      cargarOwners(proceso.mapaId);
    }
  }, [proceso?.mapaId, cargarIndicadores, cargarOwners]);

  // Manejar tab activo basado en URL
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const tab = hash || 'descripcion';
    setActiveTab(tab);
  }, [location.hash]);

  // Manejar cambio de pestaña
  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/proceso/${id}#${value}`, { replace: true });
  };

  // Estados de carga
  if (loading) return <div className="p-4">Cargando...</div>;
  if (!proceso) return <div className="p-4 text-red-500">No se encontró el detalle del proceso.</div>;

  const tieneHijos = proceso.hijos?.length > 0;

  return (
    <section className="bg-[#90A1B9] p-2">
      <Card className="flex flex-col text-lg font-bold justify-center items-center h-6 mb-3">
        <h1 className="font-semibold">
          Detalle del Proceso: <span className="font-bold">{proceso.codigo} {proceso.nombre}</span>
        </h1>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col">
        <TabsList className="w-full h-10 bg-gray-200 rounded-t-lg flex items-center justify-around shadow-lg">
          <TabsTrigger value="descripcion">Descripción</TabsTrigger>
          <TabsTrigger value="diagrama">Diagrama</TabsTrigger>
          {tieneHijos && <TabsTrigger value="ficha">Ficha</TabsTrigger>}
          {!tieneHijos && <TabsTrigger value="procedimiento">Procedimiento</TabsTrigger>}
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          
        </TabsList>

        <TabsContent value="descripcion">
          <DescripcionProceso 
            proceso={proceso || []} 
            ownersOptions={ownersList || []} 
            onUpdated={cargarProceso} 
            indicadores={indicadoresList} 
          />
        </TabsContent>

        <TabsContent value="diagrama">
          <BpmnModeler
            xmlInicial={proceso?.diagrama?.xml || undefined}
            procesoId={proceso.id}
            codigo={proceso.codigo}
            nombre={proceso.nombre}
            onDiagramaActualizado={handleDiagramaActualizado}
          />
        </TabsContent>

        <TabsContent value="ficha">
          <FichaProceso proceso={proceso || []} />
        </TabsContent>

        <TabsContent value="procedimiento">
          <ProcedimientoProceso 
            actividades={proceso?.actividades || []} 
            idProceso={proceso.id || ''} 
          />
        </TabsContent>

        <TabsContent value="indicadores">
          <IndicadoresProceso 
            proceso={proceso || []} 
            onIndicadoresAgregados={cargarProceso} 
          />
        </TabsContent>

        <TabsContent value="documentos">
          <DocumentosProceso proceso={proceso || []} />
        </TabsContent>

      </Tabs>
    </section>
  );
};