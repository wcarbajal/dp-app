import { fetchConToken } from '@/helpers/fetch';
import { useEffect, useState } from "react";

export const MapaPage = () => {
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
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Mapa de Procesos</h1>
      { loading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : (
        <div className="flex gap-5">
          <div className="bg-[#3B5C9F] rounded-lg shadow p-4 flex items-center justify-center min-h-[180px]">
            <span
              className="text-md text-white font-bold"
              style={ { writingMode: 'vertical-rl', transform: 'rotate(180deg)' } }
            >
              entrada
            </span>
          </div>

          <div className="space-y-8">
            {/* Procesos Estratégicos */ }
            <div className="w-[1000px] mx-auto">
              <div className="bg-cyan-200 rounded-lg shadow p-4">
                <h2 className="text-xl font-bold text-center mb-4">PROCESOS ESTRATÉGICOS</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  { estrategicos.length === 0 ? (
                    <span className="text-gray-500">Sin procesos estratégicos</span>
                  ) : (
                    estrategicos.map( proc => (
                      <div
                        key={ proc.id }
                        className="bg-white border border-cyan-400 rounded px-4 py-2 shadow text-center min-w-[180px]"
                      >
                        <div className="font-mono text-cyan-700 font-semibold">{ proc.codigo }</div>
                        <div className="text-gray-700">{ proc.nombre }</div>
                      </div>
                    ) )
                  ) }
                </div>
              </div>
              <div
                className="w-0 h-0 mx-auto rotate-180"
                style={ {
                  borderLeft: "500px solid transparent",
                  borderRight: "500px solid transparent",
                  borderBottom: "48px solid #a2f4fd"
                } }
              />
            </div>
            {/* Procesos Misionales */ }
            <div className="bg-fuchsia-200 rounded-lg shadow p-4">
              <h2 className="text-xl font-bold text-center mb-4">PROCESOS OPERATIVOS</h2>
              <div className="flex flex-wrap justify-center gap-4">
                { misionales.length === 0 ? (
                  <span className="text-gray-500">Sin procesos operativos</span>
                ) : (
                  misionales.map( proc => (
                    <div
                      key={ proc.id }
                      className="bg-white border border-fuchsia-400 rounded px-4 py-2 shadow text-center min-w-[180px]"
                    >
                      <div className="font-mono text-fuchsia-700 font-semibold">{ proc.codigo }</div>
                      <div className="text-gray-700">{ proc.nombre }</div>
                    </div>
                  ) )
                ) }
              </div>
            </div>

            {/* Procesos de Soporte */ }

            <div className="w-[1000px] mx-auto">
              <div
                className="w-0 h-0 mx-auto "
                style={ {
                  borderLeft: "500px solid transparent",
                  borderRight: "500px solid transparent",
                  borderBottom: "48px solid #D8F999"
                } }
              />
              <div className="bg-lime-200 rounded-lg shadow p-4">
                <h2 className="text-xl font-bold text-center mb-4">PROCESOS DE SOPORTE</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  { soporte.length === 0 ? (
                    <span className="text-gray-500">Sin procesos de soporte</span>
                  ) : (
                    soporte.map( proc => (
                      <div
                        key={ proc.id }
                        className="bg-white border border-lime-400 rounded px-4 py-2 shadow text-center min-w-[180px]"
                      >
                        <div className="font-mono text-lime-700 font-semibold">{ proc.codigo }</div>
                        <div className="text-gray-700">{ proc.nombre }</div>
                      </div>
                    ) )
                  ) }
                </div>
              </div>
            </div>

          </div>

          <div className="bg-[#3B5C9F] rounded-lg shadow p-4 flex items-center justify-center min-h-[180px]">
            <span
              className="text-md text-white font-bold"
              style={ { writingMode: 'vertical-rl', transform: 'rotate(180deg)' } }
            >
              Salida
            </span>
          </div>
        </div>
      ) }
    </div>
  );
};