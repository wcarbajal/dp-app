import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { TablaResultados } from "@/components/resultados/TablaResultados";
import { AgregarResultado } from "@/components/resultados/AgregarResultado";
import { Button } from "@/components/ui/button";


import { ArrowLeft } from "tabler-icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchConToken } from "@/helpers/fetch";
import Swal from "sweetalert2";

import { resultadoSchema } from "@/schema/ResultadoSchema";

export const ResultadosIndicadorPage = () => {

  const { indicadorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { from, indicador: indicadorFromState, procesoId } = location.state || {};
 
  const [ indicador, setIndicador ] = useState( indicadorFromState || null );
  const [ resultados, setResultados ] = useState( [] );
  const [ editingResult, setEditingResult ] = useState( null );
  
  const [ accordionValue, setAccordionValue ] = useState( "" );

  const form = useForm( {
    resolver: zodResolver( resultadoSchema ),
    defaultValues: {
      denominacion: "",
      descripcion: "",
      valor: "",
      fechaRegistro: new Date().toISOString().split( 'T' )[ 0 ],
    },
  } );

  // Cargar datos del indicador y resultados
  useEffect( () => {
    const cargarDatos = async () => {
      
      try {
        // Si no tenemos el indicador del state, lo cargamos
        if ( !indicador ) {
          const indicadorResponse = await fetchConToken( `indicador/${ indicadorId }`, {}, 'GET' );
          if ( indicadorResponse.ok ) {
            setIndicador( indicadorResponse.indicador );
          }
        }

        // Cargar resultados
        const resultadosResponse = await fetchConToken( `indicador/resultados/${ indicadorId }`, {}, 'GET' );

        

        if ( resultadosResponse.ok ) {
          setResultados( resultadosResponse.resultados || [] );
        }
      } catch ( error ) {
        console.error( "Error al cargar datos:", error );
        await Swal.fire( {
          title: 'Error',
          text: 'Error al cargar los datos del indicador',
          icon: 'error',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'Aceptar',
        } );
      } finally {
       // setLoading( false );
      }
    };

    if ( indicadorId ) {
      cargarDatos();
    }
  }, [ indicadorId, indicador ] );

  // Manejar guardado de resultado
  const handleSave = async ( data ) => {
    
    try {
      
      const resultadoData = {
        ...data,
        indicadorId: parseInt( indicadorId ),
        ...( editingResult && { id: editingResult.id } ),
      };
      

      const method = editingResult ? 'PUT' : 'POST';
      const endpoint = editingResult
        ? `resultado/${ editingResult.id }`
        : 'resultado';



      const response = await fetchConToken( endpoint, resultadoData, method );

      if ( response.ok ) {
        await Swal.fire( {
          title: 'Éxito',
          text: editingResult
            ? 'Resultado actualizado correctamente'
            : 'Resultado creado correctamente',
          icon: 'success',
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Aceptar',
        } );

        // Recargar resultados
        const resultadosResponse = await fetchConToken( `indicador/resultados/${ indicadorId }`, {}, 'GET' );
        if ( resultadosResponse.ok ) {
          setResultados( resultadosResponse.resultados || [] );
        }
        

        // Limpiar formulario
        form.reset( {
          denominacion: "",
          descripcion: "",
          valor: "",
          fechaRegistro: new Date().toISOString().split( 'T' )[ 0 ],
        } );
        setEditingResult( null );
        setAccordionValue( "" );
      } else {
        throw new Error( response.msg || 'Error al guardar el resultado' );
      }
    } catch ( error ) {
      await Swal.fire( {
        title: 'Error',
        text: error.message || 'Error al guardar el resultado',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Aceptar',
      } );
    } finally {
      //setLoading( false );
    }
  };


  // Manejar navegación de regreso
  const handleGoBack = () => {
    if ( from === 'proceso' && procesoId ) {
      navigate( `/proceso/${ procesoId }` );
    } else {
      navigate( -1 );
    }
  };

  // Limpiar formulario
  const handleClearForm = () => {
    form.reset( {
      denominacion: "",
      descripcion: "",
      valor: "",
      fechaRegistro: new Date().toISOString().split( 'T' )[ 0 ],
    } );
    setEditingResult( null );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl ">
      {/* Header */ }
      <div className="flex items-center gap-4 ">
        <Button
          variant="outline"
          onClick={ handleGoBack }
          className="flex items-center gap-2"
        >
          <ArrowLeft size={ 16 } />
          Volver
        </Button>
        <div>
          <h1 className="text-xl font-bold">Gestión de Resultados</h1>
          <p className="text-muted-foreground">
            Gestionar resultados del indicador: { indicador?.codigo } - { indicador?.nombre }
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center  gap-5">

        <div className="flex  gap-6 mt-6">
          {/* Tabla de resultados */ }
          <TablaResultados            
            setEditingResult={ setEditingResult }
            resultados={ resultados }
            indicadorId={ indicadorId }
            setResultados={ setResultados }
            form={ form }
            accordionValue={ accordionValue }
            setAccordionValue={ setAccordionValue }
          />                 

        </div>
        <AgregarResultado
          indicador={ indicador }
          accordionValue={ accordionValue }
          setAccordionValue={ setAccordionValue }
          editingResult={ editingResult }
          form={ form }
          handleSave={ handleSave }
          
          handleClearForm={ handleClearForm }
        />
      </div>
    </div>
  );
};