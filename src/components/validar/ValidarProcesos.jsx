import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Validador de estructura de procesos con reglas de negocio
export const ValidadorProcesos = ({ proceso, subprocesos, actividades }) => {
  const [validaciones, setValidaciones] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);

  const validarEstructura = useCallback(() => {
    const errores = [];
    const advertencias = [];
    const sugerencias = [];

    // 1. Validar completitud
    if (!proceso.objetivo) {
      errores.push("❌ Falta definir el objetivo del proceso");
    }
    
    if (!proceso.responsable) {
      advertencias.push("⚠️ No se ha asignado un responsable");
    }

    // 2. Validar flujo lógico
    if (subprocesos.length === 0) {
      errores.push("❌ El proceso debe tener al menos un subproceso");
    }

    // 3. Validar actividades críticas
    const actividadesSinIndicador = actividades.filter(a => !a.indicadores || a.indicadores.length === 0);
    if (actividadesSinIndicador.length > 0) {
      advertencias.push(`⚠️ ${actividadesSinIndicador.length} actividades sin indicadores de medición`);
    }

    // 4. Validar secuencia temporal
    const actividadesOrdenadas = actividades.sort((a, b) => a.orden - b.orden);
    actividadesOrdenadas.forEach((actividad, index) => {
      if (actividad.dependencias && actividad.dependencias.length > 0) {
        const dependenciasFaltantes = actividad.dependencias.filter(dep => 
          !actividadesOrdenadas.slice(0, index).some(a => a.id === dep)
        );
        if (dependenciasFaltantes.length > 0) {
          errores.push(`❌ Actividad "${actividad.nombre}" tiene dependencias no resueltas`);
        }
      }
    });

    // 5. Sugerencias de mejora
    if (actividades.length > 10) {
      sugerencias.push("💡 Considera dividir este proceso en subprocesos más pequeños");
    }

    const tiempoTotal = actividades.reduce((sum, a) => sum + (a.tiempoEstimado || 0), 0);
    if (tiempoTotal > 480) { // más de 8 horas
      sugerencias.push("💡 El proceso parece muy largo, evalúa oportunidades de automatización");
    }

    // Calcular puntuación
    const totalChecks = 10;
    const erroresCount = errores.length;
    const advertenciasCount = advertencias.length;
    const score = Math.max(0, ((totalChecks - erroresCount * 2 - advertenciasCount) / totalChecks) * 100);

    setValidaciones({ errores, advertencias, sugerencias });
    setPuntuacion(Math.round(score));
  }, [proceso, subprocesos, actividades]);

  useEffect(() => {
    validarEstructura();
  }, [validarEstructura]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🤖 Validación IA del Proceso</h3>
        <Badge variant={puntuacion >= 80 ? "success" : puntuacion >= 60 ? "warning" : "destructive"}>
          {puntuacion}% Calidad
        </Badge>
      </div>

      {/* Errores Críticos */}
      {validaciones.errores?.length > 0 && (
        <Alert className="mb-3 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Errores Críticos</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {validaciones.errores.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Advertencias */}
      {validaciones.advertencias?.length > 0 && (
        <Alert className="mb-3 border-yellow-200 bg-yellow-50">
          <Info className="h-4 w-4" />
          <AlertTitle>Advertencias</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {validaciones.advertencias.map((warning, index) => (
                <li key={index} className="text-sm">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Sugerencias */}
      {validaciones.sugerencias?.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Sugerencias de Mejora</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {validaciones.sugerencias.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
};