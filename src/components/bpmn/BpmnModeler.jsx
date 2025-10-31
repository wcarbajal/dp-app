import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

import BpmnModel from 'bpmn-js/lib/Modeler';

import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import customTranslate from './customTranslate';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { IoCodeDownloadOutline, IoDownloadOutline } from 'react-icons/io5';
import { FaRegSave } from "react-icons/fa";
import { fetchConToken } from '@/helpers/fetch';
import Swal from 'sweetalert2';
import { Activity, ChartDots3, X } from 'tabler-icons-react';

import { AnalizadorProcesos } from '@/components/validar/AnalizadorProcesos';
import { ValidadorBPMN } from '@/components/bpmn/ValidadorBPMN';
import { Dialog,  DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';


export const BpmnModeler = ( { xmlInicial, procesoId, codigo, nombre, onDiagramaActualizado } ) => {

  const [ open, setOpen ] = useState( true );

  const [ modalAnalisisOpen, setModalAnalisisOpen ] = useState( false );
  const [ procesoExtraido, setProcesoExtraido ] = useState( null );

  const containerRef = useRef( null );
  const modelerRef = useRef( null );

  const LOCAL_KEY = `${ codigo } ${ nombre } - bpmn-xml`;

  // Función para extraer información del diagrama BPMN
  const extraerInformacionProceso = async () => {
    if ( !modelerRef.current ) return null;

    try {
      const elementRegistry = modelerRef.current.get( 'elementRegistry' );
      const elementos = elementRegistry.getAll();

      const actividades = [];
      let inicios = 0;
      let finales = 0;
      let decisiones = 0;

      elementos.forEach( elemento => {
        if ( !elemento.businessObject ) return;

        const bo = elemento.businessObject;

        switch ( bo.$type ) {
          case 'bpmn:StartEvent':
            inicios++;
            actividades.push( {
              id: elemento.id,
              nombre: bo.name || 'Evento de Inicio',
              tipo: 'start',
              descripcion: 'Punto de inicio del proceso'
            } );
            break;

          case 'bpmn:EndEvent':
            finales++;
            actividades.push( {
              id: elemento.id,
              nombre: bo.name || 'Evento Final',
              tipo: 'end',
              descripcion: 'Punto final del proceso'
            } );
            break;

          case 'bpmn:Task':
          case 'bpmn:UserTask':
          case 'bpmn:ServiceTask':
          case 'bpmn:ManualTask':
          case 'bpmn:ScriptTask':
          case 'bpmn:BusinessRuleTask':
          case 'bpmn:SendTask':
          case 'bpmn:ReceiveTask':
            actividades.push( {
              id: elemento.id,
              nombre: bo.name || 'Tarea sin nombre',
              tipo: 'task',
              tipoEspecifico: bo.$type.replace( 'bpmn:', '' ),
              descripcion: bo.documentation?.[ 0 ]?.text || 'Sin descripción'
            } );
            break;

          case 'bpmn:ExclusiveGateway':
          case 'bpmn:InclusiveGateway':
          case 'bpmn:ParallelGateway':
          case 'bpmn:ComplexGateway':
          case 'bpmn:EventBasedGateway':
            decisiones++;
            actividades.push( {
              id: elemento.id,
              nombre: bo.name || `Gateway ${ bo.$type.replace( 'bpmn:', '' ) }`,
              tipo: 'decision',
              tipoEspecifico: bo.$type.replace( 'bpmn:', '' ),
              descripcion: 'Punto de decisión en el flujo'
            } );
            break;

          case 'bpmn:SubProcess':
          case 'bpmn:CallActivity':
            actividades.push( {
              id: elemento.id,
              nombre: bo.name || 'Subproceso',
              tipo: 'subprocess',
              descripcion: 'Subproceso o actividad llamada'
            } );
            break;
        }
      } );

      return {
        id: procesoId,
        nombre: nombre || 'Proceso BPMN',
        descripcion: `Proceso modelado en BPMN con ${ actividades.length } elementos`,
        objetivo: 'Automatizar y optimizar el flujo de trabajo definido',
        tipo: 'BPMN',
        actividades: actividades,
        metricas: {
          totalElementos: elementos.length,
          eventosInicio: inicios,
          eventosFinales: finales,
          decisiones: decisiones,
          tareas: actividades.filter( a => a.tipo === 'task' ).length
        }
      };
    } catch ( error ) {
      console.error( 'Error extrayendo información del proceso:', error );
      return null;
    }
  };

  // Manejar apertura del modal de análisis
  const handleAbrirAnalisis = async () => {
    const proceso = await extraerInformacionProceso();
    if ( proceso ) {
      setProcesoExtraido( proceso );
      setModalAnalisisOpen( true );
    } else {
      Swal.fire( {
        title: 'Error',
        text: 'No se pudo extraer información del diagrama BPMN',
        icon: 'error',
        confirmButtonText: 'Entendido'
      } );
    }
  };


  // Función para aplicar estilos por defecto a todos los elementos BPMN
  // Función para convertir SVG a PNG en base64
  const convertSvgToPng = ( svg ) => {
    return new Promise( ( resolve ) => {
      const img = new window.Image();
      const svgBlob = new Blob( [ svg ], { type: 'image/svg+xml;charset=utf-8' } );
      const url = URL.createObjectURL( svgBlob );

      img.onload = function () {
        const canvas = document.createElement( 'canvas' );
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext( '2d' );

        // Pinta el fondo blanco antes de dibujar el SVG
        ctx.fillStyle = '#fff';
        ctx.fillRect( 0, 0, canvas.width, canvas.height );
        ctx.drawImage( img, 0, 0 );

        canvas.toBlob( function ( blob ) {
          // Convertir blob a base64
          const reader = new FileReader();
          reader.onload = function () {
            URL.revokeObjectURL( url );
            resolve( reader.result ); // Esto es el base64
          };
          reader.readAsDataURL( blob );
        }, 'image/png' );
      };

      img.src = url;
    } );
  };

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
    modelerRef.current = new BpmnModel( {
      container: containerRef.current,
      propertiesPanel: {
        parent: '#properties-panel',

      },
      additionalModules: [
        TokenSimulationModule,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        {
          translate: [ 'value', customTranslate ]
        }
      ]
    } );

    const xmlGuardado = localStorage.getItem( LOCAL_KEY );

    const afterImport = () => {
      aplicarEstilosPorDefecto();
    };

    let xml = '';
    if ( xmlInicial && xmlInicial !== 'undefined' ) {
      if ( xmlInicial.trim().startsWith( '<' ) ) {
        // Es XML plano
        xml = xmlInicial;
      } else {
        try {
          // Si es JSON, extrae el campo xml
          const xmlObj = JSON.parse( xmlInicial );
          xml = xmlObj.xml;
        } catch ( e ) {
          // Si falla el parseo, asume que es XML plano
          console.log( "Error al parsear XML:", e );
          xml = xmlInicial;
        }
      }
    }


    if ( xml && xml.trim() !== '' ) {
      // Si xmlInicial tiene contenido, impórtalo
      modelerRef.current.importXML( xml ).then( afterImport );
    } else if ( xmlGuardado && xmlGuardado.trim() !== '' ) {
      // Si hay xml guardado en localStorage, impórtalo
      modelerRef.current.importXML( xmlGuardado ).then( afterImport );
    } else {
      // Si no hay nada, crea un diagrama nuevo
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

      if ( el.type === 'bpmn:Task' ) {
        // Por ejemplo, ancho 180, alto 60
        modeling.resizeShape( el, { width: 480, height: 60 } );
      }

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
  }, [ LOCAL_KEY, codigo, nombre, xmlInicial ] );

  const handleExportPng = async () => {
    const { svg } = await modelerRef.current.saveSVG();
    const img = new window.Image();
    const svgBlob = new Blob( [ svg ], { type: 'image/svg+xml;charset=utf-8' } );
    const url = URL.createObjectURL( svgBlob );

    img.onload = function () {
      const canvas = document.createElement( 'canvas' );
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext( '2d' );
      // Pinta el fondo blanco antes de dibujar el SVG

      ctx.fillStyle = '#fff';
      ctx.fillRect( 0, 0, canvas.width, canvas.height );
      ctx.drawImage( img, 0, 0 );
      canvas.toBlob( function ( blob ) {
        const a = document.createElement( 'a' );
        a.href = URL.createObjectURL( blob );
        a.download = `${ codigo } ${ nombre }_diag.png`;
        a.click();
        URL.revokeObjectURL( url );
      } );
    };
    img.src = url;
  };

  const handleSaveToDB = async () => {
    if ( !modelerRef.current ) return;

    try {
      // Mostrar loading
      Swal.fire( {
        title: 'Guardando diagrama...',
        text: 'Por favor espere mientras se procesa el diagrama',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      } );

      // Obtener XML
      const { xml } = await modelerRef.current.saveXML( { format: true } );

      // Obtener SVG y convertir a PNG
      const { svg } = await modelerRef.current.saveSVG();
      const pngBase64 = await convertSvgToPng( svg );

      // Preparar datos para enviar
      const dataToSend = {
        xml: xml,
        imagen: pngBase64, // Base64 del PNG
        metadatos: {
          fechaActualizacion: new Date().toISOString(),
          version: '1.0',
          herramienta: 'bpmn-js'
        }
      };

      const response = await fetchConToken(
        `procesos/${ procesoId }/registrar-diagrama`,
        dataToSend,
        'POST'
      );

      // Cerrar loading
      Swal.close();

      if ( response.ok ) {

        // Notificar al componente padre que el diagrama se actualizó
        if ( onDiagramaActualizado && typeof onDiagramaActualizado === 'function' ) {
          onDiagramaActualizado( {
            xml: xml,
            imagen: pngBase64,
            url: response.diagrama?.url || pngBase64, // URL o base64 de la imagen
            metadatos: dataToSend.metadatos
          } );
        }
        Swal.fire( {
          title: '¡Éxito!',
          text: 'Diagrama guardado correctamente en la base de datos',
          icon: 'success',
          iconColor: '#2E2E2E',
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'z-[100]',
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
          },
        } );
      } else {
        throw new Error( response.msg || 'Error al guardar el diagrama' );
      }

    } catch ( error ) {
      console.error( 'Error al guardar diagrama:', error );

      // Cerrar loading si está abierto
      Swal.close();

      Swal.fire( {
        title: 'Error',
        text: `No se pudo guardar el diagrama: ${ error.message }`,
        icon: 'error',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'z-[100]',
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        },
      } );
    }
  };

  const handleDescargarXml = async () => {
    if ( !modelerRef.current ) return;
    const { xml } = await modelerRef.current.saveXML( { format: true } );

    const blob = new Blob( [ xml ], { type: 'application/xml' } );
    const url = URL.createObjectURL( blob );

    const a = document.createElement( 'a' );
    a.href = url;
    a.download = `${ codigo } ${ nombre }.bpmn`;
    a.click();
    URL.revokeObjectURL( url );
  };

  return (
    <article className="overflow-hidden bg-slate-400 space-y-2  ">
      <Card className="flex flex-row items-center justify-between  p-2 ">

        <div className="flex items-center gap-2">
          <span className=" px-2 py-1 rounded font-semibold whitespace-nowrap">
            Importar diagrama:
          </span>
          <Input
            className="w-auto bg-slate-200 h-10"
            type="file"
            accept=".bpmn,.xml"
            onChange={ async e => {
              const file = e.target.files[ 0 ];
              if ( !file ) return;
              const text = await file.text();
              await modelerRef.current.importXML( text );
            } }
          />
        </div>
        <div className="flex flex-row items-center gap-2">

          <Button
            variant="outline"

            onClick={ handleDescargarXml } >
            <IoCodeDownloadOutline size={ 25 } />
            Descargar xml </Button>
          <Button
            variant="outline"
            onClick={ handleExportPng

            } >
            <IoDownloadOutline size={ 25 } />
            Descargar imagen
          </Button>
          <Button
            onClick={ handleSaveToDB }>
            <FaRegSave />
            Guardar
          </Button>
          {/* Modal de Análisis */ }
          <Dialog open={ modalAnalisisOpen } onOpenChange={ setModalAnalisisOpen }>
            <DialogTrigger asChild>
              <Button
                onClick={ handleAbrirAnalisis }
                variant="secondary"
                className="gap-2"
              >
                <ChartDots3 className="w-4 h-4" />
                Analizar
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Análisis Inteligente del Proceso BPMN
                </DialogTitle>
                <DialogDescription>
                  Análisis semántico y validación de flujos BPMN usando Inteligencia Artificial
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                { procesoExtraido && (
                  <>
                    {/* Información del proceso extraído */ }
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">📊 Información del Proceso</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Elementos:</span>
                          <div className="text-lg font-bold text-blue-600">
                            { procesoExtraido.metricas?.totalElementos || 0 }
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Tareas:</span>
                          <div className="text-lg font-bold text-green-600">
                            { procesoExtraido.metricas?.tareas || 0 }
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Decisiones:</span>
                          <div className="text-lg font-bold text-yellow-600">
                            { procesoExtraido.metricas?.decisiones || 0 }
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Eventos:</span>
                          <div className="text-lg font-bold text-purple-600">
                            { ( procesoExtraido.metricas?.eventosInicio || 0 ) +
                              ( procesoExtraido.metricas?.eventosFinales || 0 ) }
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Componentes de análisis */ }
                   {/*  <AnalizadorProcesos proceso={ procesoExtraido } /> */}
                    <ValidadorBPMN procesoCompleto={ procesoExtraido } />
                  </>
                ) }
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={ () => setModalAnalisisOpen( false ) }
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
      <Card style={ { display: 'flex', height: '70vh', position: 'relative', width: '100%' } }>
        <div style={ { flex: 1 } } ref={ containerRef } />
        {/* Panel de propiedades ABSOLUTO */ }
        <div className={ `
                absolute top-0 right-0
                h-[92%] w-[350px]
                bg-white
                border-l border-t border-b border-[#ddd]
                shadow-[0_0_8px_rgba(0,0,0,0.08)]
                flex flex-col
                transition-transform duration-300
                z-10
                ${ open ? 'translate-x-0' : 'translate-x-[90%]' }
                `}
        >
          <div className="relative">
            <Button
              size="sm"
              variant=""
              className="rounded-4xl absolute left-0 -top-5"
              style={ { zIndex: 100 } }
              onClick={ () => setOpen( ( v ) => !v ) }
            >
              { !open ? "⮜" : "⮞" }
            </Button>
          </div>
          <div
            id="properties-panel"
            className="w-[350px] h-full"
            style={ {
              position: 'relative',
              zIndex: 1
            } }
          />
        </div>
      </Card>
    </article>
  );
};