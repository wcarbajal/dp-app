import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Loader2, CircleCheck, AlertTriangle, Refresh, X } from "tabler-icons-react";

// Análisis semántico con Ollama
export const AnalizadorProcesos = ( { proceso } ) => {


  const [ analisis, setAnalisis ] = useState( '' );
  const [ cargando, setCargando ] = useState( false );
  const [ estadoConexion, setEstadoConexion ] = useState( 'desconocido' );
  const [ error, setError ] = useState( '' );
  const intervaloRef = useRef( null );
  const procesoIdRef = useRef( proceso?.id || 'default' );

  // Claves para localStorage
  const getStorageKey = ( suffix ) => `ollama_analisis_${ procesoIdRef.current }_${ suffix }`;


  // Limpiar estado cuando el componente se desmonte
  useEffect( () => {
    return () => {
      if ( intervaloRef.current ) {
        clearInterval( intervaloRef.current );
      }
    };
  }, [] );

  const limpiarEstadoAnalisis = useCallback(
    () => {
      localStorage.removeItem( getStorageKey( 'cargando' ) );
      localStorage.removeItem( getStorageKey( 'tiempo_inicio' ) );
      localStorage.removeItem( getStorageKey( 'request_id' ) );
      setCargando( false );
      if ( intervaloRef.current ) {
        clearInterval( intervaloRef.current );
        intervaloRef.current = null;
      }
    }, [] );

  const iniciarMonitoreoAnalisis = useCallback( () => {
    // Verificar cada 2 segundos si el análisis ha terminado
    intervaloRef.current = setInterval( async () => {
      try {
        // Aquí podrías implementar un endpoint para verificar el estado
        // Por ahora, simplemente verificamos si la conexión sigue activa
        const response = await fetch( 'http://localhost:11434/api/tags', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        } );

        if ( !response.ok ) {
          
          limpiarEstadoAnalisis();
          setError( 'Ollama se desconectó durante el análisis' );
        }
      } catch ( error ) {
        console.log( "❌ Error en monitoreo:", error );
        // No limpiar inmediatamente, podrían ser problemas temporales
      }
    }, 2000 );
  }, [ limpiarEstadoAnalisis ] );

  // Verificar si hay un análisis en progreso al cargar
  useEffect( () => {
    const analisisPrevio = localStorage.getItem( getStorageKey( 'resultado' ) );
    const cargandoPrevio = localStorage.getItem( getStorageKey( 'cargando' ) );
    const tiempoInicio = localStorage.getItem( getStorageKey( 'tiempo_inicio' ) );

    if ( analisisPrevio ) {
      setAnalisis( analisisPrevio );
    }

    if ( cargandoPrevio === 'true' && tiempoInicio ) {
      const tiempoTranscurrido = Date.now() - parseInt( tiempoInicio );

      // Si han pasado más de 10 minutos, considerar el análisis como fallido
      if ( tiempoTranscurrido > 600000 ) { // 10 minutos
        console.log( "⏰ Análisis expirado, limpiando estado" );
        limpiarEstadoAnalisis();
      } else {
        console.log( "🔄 Restaurando análisis en progreso..." );
        setCargando( true );
        iniciarMonitoreoAnalisis();
      }
    }

    verificarConexionOllama();
  }, [ iniciarMonitoreoAnalisis, limpiarEstadoAnalisis ] );


  const verificarConexionOllama = async () => {
    try {
      console.log( "🔍 Verificando conexión con Ollama..." );

      const response = await fetch( 'http://localhost:11434/api/tags', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      } );

      if ( !response.ok ) {
        throw new Error( `HTTP ${ response.status }: ${ response.statusText }` );
      }

      const data = await response.json();
      console.log( "✅ Ollama conectado. Modelos disponibles:", data.models );

      // Verificar si tiene el modelo específico
      const tieneModelo = data.models?.some( m => m.name.includes( 'llama3.2:3b' ) );

      if ( tieneModelo ) {
        setEstadoConexion( 'conectado' );
        setError( '' );
        console.log( "✅ Modelo llama3.2:3b encontrado" );
      } else {
        setEstadoConexion( 'sin-modelo' );
        setError( 'Modelo llama3.2:3b no encontrado. Ejecuta: ollama pull llama3.2:3b' );
        console.log( "⚠️ Modelo llama3.2:3b no encontrado" );
      }

    } catch ( error ) {
      console.error( "❌ Error verificando Ollama:", error );
      setEstadoConexion( 'desconectado' );

      if ( error.message.includes( 'Failed to fetch' ) || error.message.includes( 'NetworkError' ) ) {
        setError( 'No se puede conectar a Ollama. ¿Está ejecutándose en puerto 11434?' );
      } else {
        setError( `Error de conexión: ${ error.message }` );
      }
    }
  };

  const cancelarAnalisis = () => {
    console.log( "🛑 Cancelando análisis..." );
    limpiarEstadoAnalisis();
    setError( 'Análisis cancelado por el usuario' );
  };

  const analizarConIA = async () => {
    console.log( "🚀 Iniciando análisis con IA..." );

    // Marcar como cargando en localStorage
    localStorage.setItem( getStorageKey( 'cargando' ), 'true' );
    localStorage.setItem( getStorageKey( 'tiempo_inicio' ), Date.now().toString() );

    setCargando( true );
    setError( '' );
    setAnalisis( '' ); // Limpiar análisis previo

    // Iniciar monitoreo
    iniciarMonitoreoAnalisis();

    try {
      // Verificar conexión antes del análisis
      if ( estadoConexion !== 'conectado' ) {
        console.log( "⚠️ Verificando conexión antes del análisis..." );
        await verificarConexionOllama();

        if ( estadoConexion !== 'conectado' ) {
          throw new Error( 'Ollama no está disponible para análisis' );
        }
      }

      const contexto = `
Eres un experto en gestión de procesos. Analiza el siguiente proceso:

PROCESO: ${ proceso.nombre || 'Sin nombre' }
DESCRIPCIÓN: ${ proceso.descripcion || 'Sin descripción' }
OBJETIVO: ${ proceso.objetivo || 'Sin objetivo' }

ACTIVIDADES:
${ proceso.actividades?.map( ( a, i ) => `${ i + 1 }. ${ a.nombre }: ${ a.descripcion || 'Sin descripción' }` ).join( '\n' ) || 'Sin actividades' }

Evalúa:
1. 🎯 COHERENCIA: ¿Las actividades están alineadas con el objetivo?
2. ⚡ EFICIENCIA: ¿Hay cuellos de botella o redundancias?
3. 🤖 AUTOMATIZACIÓN: ¿Qué se puede automatizar?
4. ⚠️ RIESGOS: ¿Qué riesgos operacionales identificas?
5. 📈 MEJORAS: ¿Qué mejoras específicas recomiendas?

Responde en español, sé conciso y profesional.`;

      console.log( "📤 Enviando solicitud a Ollama..." );

      const response = await fetch( 'http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {
          model: 'llama3.2:3b',
          prompt: contexto,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
            top_k: 40,
            num_predict: 1000,
            num_ctx: 2048
          }
        } )
      } );

      console.log( "📥 Respuesta recibida de Ollama:", response.status );

      if ( !response.ok ) {
        const errorText = await response.text();
        console.error( "❌ Error en respuesta:", errorText );
        throw new Error( `Error ${ response.status }: ${ errorText.substring( 0, 200 ) }` );
      }

      const data = await response.json();
      console.log( "✅ Datos recibidos:", data );

      if ( data.response && data.response.trim() ) {
        const resultado = data.response;
        setAnalisis( resultado );
        // Guardar resultado en localStorage
        localStorage.setItem( getStorageKey( 'resultado' ), resultado );
        console.log( "✅ Análisis completado exitosamente" );
      } else {
        console.log( "❌ Respuesta vacía del modelo" );
        throw new Error( 'Respuesta vacía del modelo IA' );
      }

    } catch ( error ) {
      console.error( '❌ Error en análisis IA:', error );

      let mensajeError = '';
      if ( error.message.includes( 'Failed to fetch' ) || error.message.includes( 'NetworkError' ) ) {
        mensajeError = 'Error de conexión: Verifica que Ollama esté ejecutándose';
      } else {
        mensajeError = `Error: ${ error.message }`;
      }

      setError( mensajeError );

      // Generar análisis básico como respaldo
      console.log( "🔄 Generando análisis básico como respaldo..." );
      const analisisBasico = generarAnalisisBasico( proceso );
      setAnalisis( analisisBasico );
      localStorage.setItem( getStorageKey( 'resultado' ), analisisBasico );

    } finally {
      // Limpiar estado de carga
      limpiarEstadoAnalisis();
      console.log( "🏁 Análisis finalizado" );
    }
  };

  const generarAnalisisBasico = ( proceso ) => {
    return `📊 ANÁLISIS BÁSICO DEL PROCESO

🎯 PROCESO: ${ proceso.nombre || 'Sin nombre' }

1. 📋 EVALUACIÓN DE COMPLETITUD:
   ${ proceso.nombre ? '✅' : '❌' } Nombre del proceso
   ${ proceso.descripcion ? '✅' : '❌' } Descripción completa
   ${ proceso.objetivo ? '✅' : '❌' } Objetivo definido
   ${ proceso.actividades?.length > 0 ? '✅' : '❌' } Actividades definidas

2. ⚡ ANÁLISIS DE ACTIVIDADES:
   • Total de actividades: ${ proceso.actividades?.length || 0 }
   ${ proceso.actividades?.length > 8 ? '💡 Considera dividir en subprocesos (>8 actividades)' : '' }
   ${ proceso.actividades?.filter( a => !a.descripcion ).length > 0 ?
        `⚠️ ${ proceso.actividades.filter( a => !a.descripcion ).length } actividades sin descripción` : '' }

3. 🚀 RECOMENDACIONES BÁSICAS:
   • Completar información faltante
   • Definir responsables por actividad
   • Establecer tiempos de ejecución
   • Identificar puntos de control
   • Documentar riesgos asociados

💡 Nota: Análisis básico generado. Para análisis avanzado con IA, verifica la conexión con Ollama.`;
  };

  const limpiarAnalisis = () => {
    setAnalisis( '' );
    localStorage.removeItem( getStorageKey( 'resultado' ) );
  };

  const getEstadoInfo = () => {
    switch ( estadoConexion ) {
      case 'conectado':
        return { color: 'text-green-600', icon: <CircleCheck className="w-4 h-4" />, texto: 'IA Lista' };
      case 'desconectado':
        return { color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" />, texto: 'Sin Conexión' };
      case 'sin-modelo':
        return { color: 'text-yellow-600', icon: <AlertTriangle className="w-4 h-4" />, texto: 'Sin Modelo' };
      default:
        return { color: 'text-gray-600', icon: <Refresh className="w-4 h-4" />, texto: 'Verificando...' };
    }
  };

  const estadoInfo = getEstadoInfo();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🔬 Análisis Semántico de proceso</h3>
        <div className="flex items-center gap-3 ">
          {/* Indicador de estado */ }
          <div className={ `flex items-center gap-1 text-sm ${ estadoInfo.color } border p-1 rounded-xl bg-slate-200 gap-2` }>
            { estadoInfo.icon }
            <span>{ estadoInfo.texto }</span>
            {/* Botón verificar */ }
            <Button
              variant="outline"
              size="sm"
              onClick={ verificarConexionOllama }
              disabled={ cargando }
              title="Verificar conexión con Ollama"
            >
              <Refresh className="w-4 h-4" />
            </Button>
          </div>



          {/* Botón cancelar (solo visible durante carga) */ }
          { cargando && (
            <Button
              variant="outline"
              size="sm"
              onClick={ cancelarAnalisis }
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
              title="Cancelar análisis"
            >
              <X className="w-4 h-4" />
            </Button>
          ) }

          {/* Botón analizar */ }
          <Button
            onClick={ analizarConIA }
            disabled={ cargando || !proceso }
            className="gap-2"
          >
            { cargando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            ) }
            { cargando ? 'Analizando...' : 'Analizar Proceso' }
          </Button>
        </div>
      </div>

      {/* Mostrar errores */ }
      { error && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Estado del Sistema</AlertTitle>
          <AlertDescription className="text-sm">{ error }</AlertDescription>
        </Alert>
      ) }

      {/* Mostrar progreso mientras carga */ }
      { cargando && (
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Procesando...</AlertTitle>
          <AlertDescription className="text-sm">
            Analizando proceso con IA. El estado se mantiene aunque cambies de pestaña.
            <br />
            <span className="text-xs text-blue-500">
              💡 Tip: Puedes cancelar el análisis con el botón ✕
            </span>
          </AlertDescription>
        </Alert>
      ) }

      {/* Mostrar análisis */ }
      { analisis && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">📋 Reporte de Análisis</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                { estadoConexion === 'conectado' ? 'Análisis IA Avanzado' : 'Análisis Básico' }
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={ limpiarAnalisis }
                className="h-6 w-6 p-0"
                title="Limpiar análisis"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            { analisis }
          </div>
        </div>
      ) }

      {/* Información del sistema */ }
      {/* <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 font-medium mb-1">🔧 Estado Persistente:</p>
        <div className="text-xs text-blue-600 space-y-1">
          <div>• Estado Ollama: { estadoInfo.texto }</div>
          <div>• Puerto verificado: 11434</div>
          <div>• Estado persiste entre pestañas ✅</div>
          <div>• Botón bloqueado durante análisis ✅</div>
        </div>
      </div> */}
    </Card>
  );
};