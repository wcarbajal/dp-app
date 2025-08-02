import { EntradaSalida } from '@/components/mapa/EntradaSalida';
import { MapaView } from '@/components/mapa/MapaView';
import { ProcesosMapa } from '@/components/mapa/ProcesosMapa';
import { Button } from '@/components/ui/button';
import { fetchConToken } from '@/helpers/fetch';
import { useEffect, useState } from "react";

import { Link } from 'react-router';


export const MapaPage = () => {

  const [ mapa, setMapa ] = useState( {
    ok: false,
    nombre: "",
    entrada: "",
    salida: ""
  } );


  const [ es ] = useState(
    {
      entrada: "Ciudadanos de bajos, insucientes recursos o alto rendimiento académico con barreras de acceso a la educación superior de calidad.",
      salida: "Ciudadanos que accedieron a la educación superior de calidad y contribuyen al desarrollo económico y social."
    }
  );

  const [ procesos, setProcesos ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  

 

  // Cargar procesos activos
  useEffect( () => {
    const cargarProcesos = async () => {
      try {
        const respuesta = await fetchConToken( "mapa" );
        console.log( "respuesta", respuesta );

        if ( respuesta.ok === false ) {
          setLoading( false );
          return;
        }
        setMapa( respuesta.mapa );
        console.log( "ESTO NO DEBE SALIR si el mapa no existe" );

        const data = await fetchConToken( "procesos/nivel0" );
        setProcesos( data.procesos || [] );
        setLoading( false );
      } catch ( error ) {
        console.error( "Error al cargar procesos:", error );
      }
    };
    cargarProcesos();
  }, [ mapa ] );

  // Agrupar procesos por tipo
  const estrategicos = procesos.filter( p => p.tipo === "Estratégico" );
  const misionales = procesos.filter( p => p.tipo === "Misional" );
  const soporte = procesos.filter( p => p.tipo === "Soporte" );

  return (
    <div className="flex flex-col gap-5 w-full justify-center items-center shadow-lg">
      <h1 className="text-xl font-bold text-center ">Mapa de Procesos del PRONABEC</h1>
      { loading
        ? ( <div className="text-center text-gray-500">Cargando...</div> )
        : (
          ( !mapa.ok === false )
            ? (

              <MapaView
                entrada={ es.entrada }
                salida={ es.salida }
                estrategicos={ estrategicos }
                misionales={ misionales }
                soporte={ soporte }
              />
            )
            : (
              < div className="text-center gap-5 text-gray-500 mb-5">
                <span className="text-gray-500">No hay mapa registrado</span>
                <br />
                <Button variant="link">
                  <Link to="/config/mapa" className="text-blue-500">Ir a registrar Mapa</Link>
                </Button>
              

              </div>
            )

        )

      }
    </div >
  );
};