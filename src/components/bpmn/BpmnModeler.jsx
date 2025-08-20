import BpmnJS from 'bpmn-js';
import { useEffect, useRef } from 'react';

export default function BpmnModeler() {
  const containerRef = useRef(null);

  useEffect(() => {
    const bpmnModeler = new BpmnJS({ container: containerRef.current });
    // Puedes cargar un diagrama vacío o uno existente
    bpmnModeler.createDiagram();
    return () => bpmnModeler.destroy();
  }, []);

  return <div style={{ width: '100%', height: 500 }} ref={containerRef} />;
}