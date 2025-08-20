import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';

export default function BpmnModelerComponent( { procesoId } ) {
  const containerRef = useRef( null );
  const modelerRef = useRef( null );

  const LOCAL_KEY = `bpmn-xml-${ procesoId }`;

  // Función para aplicar estilos por defecto a todos los elementos BPMN
  const aplicarEstilosPorDefecto = () => {

    const modeling = modelerRef.current.get( 'modeling' );
    const elementRegistry = modelerRef.current.get( 'elementRegistry' );
    // Puedes ajustar los tipos y colores según tus necesidades
    const tipos = [
      'bpmn:StartEvent',
      'bpmn:ExclusiveGateway',
      'bpmn:InclusiveGateway',
      'bpmn:ParallelGateway',
      'bpmn:ComplexGateway',
      'bpmn:EventBasedGateway'
    ];
    elementRegistry.filter( el =>
      tipos.includes( el.type )
    ).forEach( el => {
      modeling.setColor( el, {
        fill: '#FFFFE3',    // color de fondo
        stroke: '#A6A61D'   // color de borde
      } );
    } );

    const tipos2 = [
      'bpmn:Task',
      'bpmn:UserTask',
      'bpmn:ServiceTask',
      'bpmn:ManualTask',
      'bpmn:ScriptTask',
      'bpmn:BusinessRuleTask',
      'bpmn:SendTask',
      'bpmn:ReceiveTask',
      'bpmn:CallActivity',
      'bpmn:SubProcess',
      'bpmn:Transaction',
      'bpmn:AdHocSubProcess'
    ];
    elementRegistry.filter( el =>
      tipos2.includes( el.type )
    ).forEach( el => {
      modeling.setColor( el, {
        fill: '#F9FAFF',    // color de fondo
        stroke: '#3C89B2'   // color de borde
      } );
    } );
    const tipos3 = [
      'bpmn:IntermediateThrowEvent',
      'bpmn:IntermediateCatchEvent',
      'bpmn:BoundaryEvent'
    ];
    elementRegistry.filter( el =>
      tipos3.includes( el.type )
    ).forEach( el => {
      modeling.setColor( el, {
        fill: '#FFFDF9',    // color de fondo
        stroke: '#969149'   // color de borde
      } );
    } );
    const tipos4 = [
      'bpmn:EndEvent'
    ];
    elementRegistry.filter( el =>
      tipos4.includes( el.type )
    ).forEach( el => {
      modeling.setColor( el, {
        fill: '#F9E6E6',    // color de fondo
        stroke: '#990000'   // color de borde
      } );
    } );

  };

  useEffect( () => {
    modelerRef.current = new BpmnModeler( { container: containerRef.current } );

    const xmlGuardado = localStorage.getItem( LOCAL_KEY );

    const afterImport = () => {
      aplicarEstilosPorDefecto();
    };

    if ( xmlGuardado ) {
      modelerRef.current.importXML( xmlGuardado ).then( afterImport );
    } else {
      modelerRef.current.createDiagram().then( afterImport );
    }

    // Guardar en localStorage al cambiar el diagrama
    const guardarLocalStorage = async () => {
      const { xml } = await modelerRef.current.saveXML( { format: true } );
      localStorage.setItem( LOCAL_KEY, xml );
    };
    modelerRef.current.on( 'commandStack.changed', guardarLocalStorage );

    // === NUEVO: aplicar estilo al crear un elemento desde la paleta ===
    const modeling = modelerRef.current.get( 'modeling' );
    const applyStyleOnCreate = ( event ) => {
      const el = event.element;
      if ( !el || !el.type ) return;

      // Define tus tipos y colores
      const estilos = [
        {
          tipos: [
            'bpmn:StartEvent',
            'bpmn:ExclusiveGateway',
            'bpmn:InclusiveGateway',
            'bpmn:ParallelGateway',
            'bpmn:ComplexGateway',
            'bpmn:EventBasedGateway'
          ],
          fill: '#FFFFE3',
          stroke: '#A6A61D'
        },
        {
          tipos: [
            'bpmn:Task',
            'bpmn:UserTask',
            'bpmn:ServiceTask',
            'bpmn:ManualTask',
            'bpmn:ScriptTask',
            'bpmn:BusinessRuleTask',
            'bpmn:SendTask',
            'bpmn:ReceiveTask',
            'bpmn:CallActivity',
            'bpmn:SubProcess',
            'bpmn:Transaction',
            'bpmn:AdHocSubProcess'
          ],
          fill: '#F9FAFF',
          stroke: '#3C89B2'
        },
        {
          tipos: [
            'bpmn:IntermediateThrowEvent',
            'bpmn:IntermediateCatchEvent',
            'bpmn:BoundaryEvent'
          ],
          fill: '#FFFDF9',
          stroke: '#969149'
        },
        {
          tipos: [ 'bpmn:EndEvent' ],
          fill: '#F9E6E6',
          stroke: '#990000'
        }
      ];

      for ( const estilo of estilos ) {
        if ( estilo.tipos.includes( el.type ) ) {
          modeling.setColor( el, { fill: estilo.fill, stroke: estilo.stroke } );
          break;
        }
      }
    };

    modelerRef.current.on( 'element.created', applyStyleOnCreate );

    return () => {
      modelerRef.current.off( 'element.created', applyStyleOnCreate );
      modelerRef.current.destroy();
    };
  }, [ LOCAL_KEY, procesoId ] );




  const handleSaveToDB = async () => {
    if ( !modelerRef.current ) return;
    const { xml } = await modelerRef.current.saveXML( { format: true } );

    await fetch( '/api/diagramas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { procesoId, xml } ),
    } );
    alert( '¡Diagrama guardado en la base de datos!' );
  };

  return (
    <section>
      <Button onClick={ handleSaveToDB }>
        Guardar
      </Button>
      <div style={ { width: '100%', height: 500 } } ref={ containerRef } />
    </section>
  );
}