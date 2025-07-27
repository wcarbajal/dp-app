import { EntradaSalida } from '@/components/mapa/EntradaSalida';
import { ProcesosMapa } from '@/components/mapa/ProcesosMapa';
import { fetchConToken } from '@/helpers/fetch';
import { useEffect, useState } from "react";

export const MapaPage = () => {

  const [ es ] = useState(
    {
      entrada: "Ciudadanos de bajos, insucientes recursos o alto rendimiento académico con barreras de acceso a la educación superior de calidad.",
      salida: "Ciudadanos que accedieron a la educación superior de calidad y contribuyen al desarrollo económico y social."
    }
  )
    
  const [ procesos, setProcesos ] = useState( [] );
  const [ loading, setLoading ] = useState( true );


  // Cargar procesos activos
  useEffect( () => {
    const cargarProcesos = async () => {
      try {
        const data = await fetchConToken( "procesos/nivel0" );
        setProcesos( data.procesos || [] );
        setLoading( false );
      } catch ( error ) {
        console.error( "Error al cargar procesos:", error );
      }
    };
    cargarProcesos();
  }, [] );

  // Agrupar procesos por tipo
  const estrategicos = procesos.filter( p => p.tipo === "Estratégico" );
  const misionales = procesos.filter( p => p.tipo === "Misional" );
  const soporte = procesos.filter( p => p.tipo === "Soporte" );

  return (
    <div className="flex flex-col gap-5 w-full justify-center items-center shadow-lg">
      <h1 className="text-xl font-bold text-center ">Mapa de Procesos del PRONABEC</h1>
      { loading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : (
        <div className="flex gap-5 h-[650px] m-2 rounded-2xl w-[900px]">

          {/* entradas */ }
          <EntradaSalida objetivo={ es.entrada } />
          
          {/* Procesos */ }
          <div className="flex gap-5 flex-col ">
            {/* Procesos Estratégicos */ }
            <ProcesosMapa procesos={ estrategicos } tipo="estrategicos" />
            {/* Procesos Misionales */ }
            <ProcesosMapa procesos={ misionales } tipo="misionales" />

            {/* Procesos de Soporte */ }
            <ProcesosMapa procesos={ soporte } tipo="soporte" />

          </div>

          {/* Salida */ }
          <EntradaSalida objetivo={ es.salida } /> 
        </div>
      ) }
    </div>
  );
};