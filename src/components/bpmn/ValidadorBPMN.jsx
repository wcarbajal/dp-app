import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Loader2, 
  CircleCheck, 
  AlertTriangle, 
  Refresh, 
  X,
 
} from "tabler-icons-react";

export const ValidadorBPMN = ({ procesoCompleto }) => {
  const [validacion, setValidacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [estadoConexion, setEstadoConexion] = useState('desconocido');
  const [error, setError] = useState('');
  const [metricas, setMetricas] = useState(null);
  const intervaloRef = useRef(null);
  const procesoIdRef = useRef(procesoCompleto?.id || 'default');

  const getStorageKey = (suffix) => `bpmn_validacion_${procesoIdRef.current}_${suffix}`;

  const limpiarEstadoValidacion = useCallback(() => {
    localStorage.removeItem(getStorageKey('cargando'));
    localStorage.removeItem(getStorageKey('tiempo_inicio'));
    localStorage.removeItem(getStorageKey('resultado'));
    setCargando(false);
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  }, []);

  const iniciarMonitoreoValidacion = useCallback(() => {
    intervaloRef.current = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          limpiarEstadoValidacion();
          setError('Ollama se desconectó durante la validación');
        }
      } catch (error) {
        console.log("❌ Error en monitoreo BPMN:", error);
      }
    }, 2000);
  }, [limpiarEstadoValidacion]);

  useEffect(() => {
    const validacionPrevia = localStorage.getItem(getStorageKey('resultado'));
    const cargandoPrevio = localStorage.getItem(getStorageKey('cargando'));
    const tiempoInicio = localStorage.getItem(getStorageKey('tiempo_inicio'));

    if (validacionPrevia) {
      const data = JSON.parse(validacionPrevia);
      setValidacion(data.validacion || '');
      setMetricas(data.metricas || null);
    }

    if (cargandoPrevio === 'true' && tiempoInicio) {
      const tiempoTranscurrido = Date.now() - parseInt(tiempoInicio);
      
      if (tiempoTranscurrido > 600000) {
        console.log("⏰ Validación BPMN expirada");
        limpiarEstadoValidacion();
      } else {
        console.log("🔄 Restaurando validación BPMN en progreso...");
        setCargando(true);
        iniciarMonitoreoValidacion();
      }
    }

    verificarConexionOllama();
  }, [iniciarMonitoreoValidacion, limpiarEstadoValidacion]);

  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);

  const verificarConexionOllama = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const tieneModelo = data.models?.some(m => m.name.includes('llama3.2:3b'));
      
      if (tieneModelo) {
        setEstadoConexion('conectado');
        setError('');
      } else {
        setEstadoConexion('sin-modelo');
        setError('Modelo llama3.2:3b no encontrado para validación BPMN');
      }
    } catch (error) {
      console.log(error)
      setEstadoConexion('desconectado');
      setError('No se puede conectar a Ollama para validación BPMN');
    }
  };

  const generarMetricasBPMN = (proceso) => {
    const actividades = proceso.actividades || [];
    const decisiones = actividades.filter(a => a.tipo === 'decision' || a.nombre?.toLowerCase().includes('decidir')).length;
    const tareas = actividades.filter(a => a.tipo === 'task' || (!a.tipo && a.nombre)).length;
    const eventos = actividades.filter(a => a.tipo === 'event').length;
    
    const complejidadCiclomatica = decisiones + 1;
    const densidadDecisiones = actividades.length > 0 ? (decisiones / actividades.length * 100).toFixed(1) : 0;
    
    return {
      totalElementos: actividades.length,
      tareas: tareas,
      decisiones: decisiones,
      eventos: eventos,
      complejidadCiclomatica: complejidadCiclomatica,
      densidadDecisiones: parseFloat(densidadDecisiones),
      nivel: complejidadCiclomatica <= 3 ? 'Bajo' : complejidadCiclomatica <= 7 ? 'Medio' : 'Alto'
    };
  };

  const validarConIA = async () => {
    console.log("🔄 Iniciando validación BPMN con IA...");
    
    localStorage.setItem(getStorageKey('cargando'), 'true');
    localStorage.setItem(getStorageKey('tiempo_inicio'), Date.now().toString());
    
    setCargando(true);
    setError('');
    setValidacion('');
    setMetricas(null);

    iniciarMonitoreoValidacion();

    try {
      if (estadoConexion !== 'conectado') {
        await verificarConexionOllama();
        if (estadoConexion !== 'conectado') {
          throw new Error('Ollama no está disponible para validación BPMN');
        }
      }

      const metricas = generarMetricasBPMN(procesoCompleto);
      setMetricas(metricas);

      const contexto = `
Eres un experto en BPMN (Business Process Model and Notation) y modelado de procesos. 
Valida exhaustivamente el siguiente proceso de negocio según estándares BPMN 2.0:

INFORMACIÓN DEL PROCESO:
- Nombre: ${procesoCompleto.nombre || 'Sin nombre'}
- Descripción: ${procesoCompleto.descripcion || 'Sin descripción'}
- Objetivo: ${procesoCompleto.objetivo || 'Sin objetivo'}
- Tipo: ${procesoCompleto.tipo || 'No especificado'}

ACTIVIDADES DEL PROCESO (${metricas.totalElementos} elementos):
${procesoCompleto.actividades?.map((a, i) => `
${i+1}. ${a.nombre || 'Sin nombre'}
   - Tipo: ${a.tipo || 'No especificado'}
   - Descripción: ${a.descripcion || 'Sin descripción'}
   - Responsable: ${a.responsable || 'Sin asignar'}
   - Duración: ${a.duracion || 'No definida'}
`).join('\n') || 'Sin actividades definidas'}

MÉTRICAS CALCULADAS:
- Complejidad Ciclomática: ${metricas.complejidadCiclomatica}
- Densidad de Decisiones: ${metricas.densidadDecisiones}%
- Nivel de Complejidad: ${metricas.nivel}

VALIDACIÓN REQUERIDA (Estructura tu respuesta así):

🔍 **CONFORMIDAD BPMN 2.0:**
- Validar nomenclatura y convenciones
- Verificar tipos de elementos BPMN
- Comprobar flujos y conexiones lógicas

⚡ **ANÁLISIS DE FLUJO:**
- Evaluar puntos de inicio y fin
- Identificar bucles infinitos o deadlocks
- Verificar caminos alternativos y excepciones

🎯 **COHERENCIA ESTRUCTURAL:**
- Alineación entre actividades y objetivo
- Secuencia lógica de tareas
- Puntos de decisión bien definidos

⚠️ **DETECCIÓN DE ANTI-PATRONES:**
- Procesos lineales sin puntos de control
- Actividades duplicadas o redundantes
- Falta de manejo de excepciones

📊 **MÉTRICAS DE CALIDAD:**
- Evaluación de complejidad
- Sugerencias de optimización
- Puntos de mejora específicos

🚀 **RECOMENDACIONES:**
- Mejoras de modelado BPMN
- Optimizaciones de flujo
- Estándares de nomenclatura

Responde en español de forma estructurada y profesional. Sé específico y técnico.`;

      console.log("📤 Enviando solicitud de validación BPMN a Ollama...");

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: contexto,
          stream: false,
          options: {
            temperature: 0.2, // Más determinista para validaciones técnicas
            top_p: 0.9,
            top_k: 40,
            num_predict: 2000, // Más tokens para análisis detallado
            num_ctx: 4096
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();

      if (data.response && data.response.trim()) {
        const resultado = data.response;
        setValidacion(resultado);
        
        // Guardar resultado completo
        const resultadoCompleto = {
          validacion: resultado,
          metricas: metricas,
          timestamp: Date.now()
        };
        localStorage.setItem(getStorageKey('resultado'), JSON.stringify(resultadoCompleto));
        
        console.log("✅ Validación BPMN completada exitosamente");
      } else {
        throw new Error('Respuesta vacía del modelo de validación BPMN');
      }

    } catch (error) {
      console.error('❌ Error en validación BPMN:', error);
      
      let mensajeError = '';
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        mensajeError = 'Error de conexión: Verifica que Ollama esté ejecutándose';
      } else {
        mensajeError = `Error: ${error.message}`;
      }
      
      setError(mensajeError);
      
      // Generar validación básica como respaldo
      const validacionBasica = generarValidacionBasica(procesoCompleto);
      setValidacion(validacionBasica);
      
      const resultadoBasico = {
        validacion: validacionBasica,
        metricas: generarMetricasBPMN(procesoCompleto),
        timestamp: Date.now(),
        tipo: 'basica'
      };
      localStorage.setItem(getStorageKey('resultado'), JSON.stringify(resultadoBasico));

    } finally {
      limpiarEstadoValidacion();
    }
  };

  const generarValidacionBasica = (proceso) => {
    const metricas = generarMetricasBPMN(proceso);
    
    return `🔍 **VALIDACIÓN BÁSICA BPMN**

📊 **MÉTRICAS DEL PROCESO:**
- Total de elementos: ${metricas.totalElementos}
- Tareas: ${metricas.tareas}
- Decisiones: ${metricas.decisiones}
- Eventos: ${metricas.eventos}
- Complejidad: ${metricas.nivel} (${metricas.complejidadCiclomatica})

✅ **VALIDACIONES BÁSICAS:**
${proceso.nombre ? '✅' : '❌'} Nombre del proceso definido
${proceso.objetivo ? '✅' : '❌'} Objetivo claramente establecido
${proceso.actividades?.length > 0 ? '✅' : '❌'} Actividades definidas
${proceso.actividades?.length >= 3 ? '✅' : '⚠️'} Flujo mínimo (≥3 actividades)

⚠️ **PUNTOS DE ATENCIÓN:**
${!proceso.nombre ? '• Definir nombre del proceso\n' : ''}${!proceso.objetivo ? '• Establecer objetivo claro\n' : ''}${metricas.totalElementos === 0 ? '• Agregar actividades al proceso\n' : ''}${metricas.totalElementos > 0 && metricas.decisiones === 0 ? '• Considerar agregar puntos de decisión\n' : ''}${metricas.complejidadCiclomatica > 10 ? '• Simplificar proceso (complejidad alta)\n' : ''}

🚀 **RECOMENDACIONES:**
• Completar información faltante
• Definir responsables para cada actividad
• Establecer criterios de decisión claros
• Documentar excepciones y casos especiales
• Validar flujos con stakeholders

💡 **Nota:** Validación básica generada. Para análisis BPMN avanzado, conecta con Ollama.`;
  };

  const cancelarValidacion = () => {
    limpiarEstadoValidacion();
    setError('Validación BPMN cancelada por el usuario');
  };

  const limpiarValidacion = () => {
    setValidacion('');
    setMetricas(null);
    localStorage.removeItem(getStorageKey('resultado'));
  };

  const getEstadoInfo = () => {
    switch (estadoConexion) {
      case 'conectado':
        return { color: 'text-green-600', icon: <CircleCheck className="w-4 h-4" />, texto: 'IA BPMN Lista' };
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
        <h3 className="text-lg font-semibold">🔄 Validación de Flujos BPMN</h3>
        <div className="flex items-center gap-3">
          {/* Indicador de estado */}
          <div className={`flex items-center gap-1 text-sm ${estadoInfo.color} border p-1 rounded-xl bg-slate-200 gap-2`}>
            {estadoInfo.icon}
            <span>{estadoInfo.texto}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={verificarConexionOllama}
              disabled={cargando}
              title="Verificar conexión IA para BPMN"
            >
              <Refresh className="w-4 h-4" />
            </Button>
          </div>

          {/* Botón cancelar */}
          {cargando && (
            <Button
              variant="outline"
              size="sm"
              onClick={cancelarValidacion}
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
              title="Cancelar validación BPMN"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {/* Botón validar */}
          <Button
            onClick={validarConIA}
            disabled={cargando || !procesoCompleto}
            className="gap-2"
          >
            {cargando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GitBranch className="w-4 h-4" />
            )}
            {cargando ? 'Validando BPMN...' : 'Validar Flujo BPMN'}
          </Button>
        </div>
      </div>

      {/* Métricas del proceso */}
      {metricas && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{metricas.totalElementos}</div>
            <div className="text-xs text-blue-700">Elementos Total</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{metricas.complejidadCiclomatica}</div>
            <div className="text-xs text-green-700">Complejidad</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{metricas.decisiones}</div>
            <div className="text-xs text-yellow-700">Decisiones</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <Badge 
              variant={metricas.nivel === 'Bajo' ? 'default' : metricas.nivel === 'Medio' ? 'secondary' : 'destructive'}
              className="w-full"
            >
              {metricas.nivel}
            </Badge>
            <div className="text-xs text-purple-700 mt-1">Nivel</div>
          </div>
        </div>
      )}

      {/* Errores */}
      {error && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Estado del Validador BPMN</AlertTitle>
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Progreso */}
      {cargando && (
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Validando Flujo BPMN...</AlertTitle>
          <AlertDescription className="text-sm">
            Analizando conformidad BPMN 2.0, detectando anti-patrones y evaluando métricas de calidad.
            <br />
            <span className="text-xs text-blue-500">
              🔄 El análisis continúa aunque cambies de pestaña
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Resultados de validación */}
      {validacion && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">📋 Reporte de Validación BPMN</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {estadoConexion === 'conectado' ? 'Validación IA Avanzada' : 'Validación Básica'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarValidacion}
                className="h-6 w-6 p-0"
                title="Limpiar validación"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {validacion}
          </div>
        </div>
      )}
    </Card>
  );
};