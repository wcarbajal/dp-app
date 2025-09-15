import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RenderIndicadorArbol } from '@/utils/RenderIndicadorArbol';
import { useState } from 'react';

const indicadoresIniciales = [

  {
    id: 1,
    codigo: "OEI.0X",
    nombre: "Mejorar la calidad psicologica",
    tipo: "OEI",
    hijos: [
      {
        id: 2,
        codigo: "AEI.01",
        nombre: "Capacitación docente",
        tipo: "AEI",
        hijos: [
          {
            id: 3,
            codigo: "IP.01",
            nombre: "N° de docentes capacitados",
            tipo: "IP",
            hijos: [
              {
                id: 4,
                codigo: "AEI.01",
                nombre: "Capacitación docente",
                tipo: "AEI",
                hijos: [
                  {
                    id: 5,
                    codigo: "IP.01",
                    nombre: "N° de docentes capacitados",
                    tipo: "IP",
                    hijos: []
                  },
                  {
                    id: 6,
                    codigo: "IP.02",
                    nombre: "Horas de capacitación",
                    tipo: "IP",
                    hijos: []
                  },
                  {
                    id: 7,
                    codigo: "IP.01",
                    nombre: "N° de docentes capacitados",
                    tipo: "IP",
                    hijos: []
                  },
                  {
                    id: 8,
                    codigo: "IP.02",
                    nombre: "Horas de capacitación",
                    tipo: "IP",
                    hijos: []
                  }
                ]
              },
            ]
          },
          {
            id: 9,
            codigo: "IP.02",
            nombre: "Horas de capacitación",
            tipo: "IP",
            hijos: []
          },
          {
            id: 10,
            codigo: "IP.01",
            nombre: "N° de docentes capacitados",
            tipo: "IP",
            hijos: []
          },
          {
            id: 11,
            codigo: "IP.02",
            nombre: "Horas de capacitación",
            tipo: "IP",
            hijos: []
          }
        ]
      },
      {
        id: 12,
        codigo: "AEI.02",
        nombre: "Mejorar infraestructura",
        tipo: "AEI",
        hijos: [
          {
            id: 13,
            codigo: "IP.03",
            nombre: "Aulas renovadas",
            tipo: "IP",
            hijos: []
          }
        ]
      }
    ]
  },
  {
    id: 14,
    codigo: "OEI.0X",
    nombre: "Mejorar la calidad psicologica",
    tipo: "OEI",
    hijos: [
      {
        id: 15,
        codigo: "AEI.01",
        nombre: "Capacitación docente",
        tipo: "AEI",
        hijos: [
          {
            id: 16,
            codigo: "IP.01",
            nombre: "N° de docentes capacitados",
            tipo: "IP",
            hijos: []
          },
          {
            id: 17,
            codigo: "IP.02",
            nombre: "Horas de capacitación",
            tipo: "IP",
            hijos: []
          },
          {
            id: 18,
            codigo: "IP.01",
            nombre: "N° de docentes capacitados",
            tipo: "IP",
            hijos: []
          },
          {
            id: 19,
            codigo: "IP.02",
            nombre: "Horas de capacitación",
            tipo: "IP",
            hijos: []
          }
        ]
      },
      {
        id: 20,
        codigo: "AEI.02",
        nombre: "Mejorar infraestructura",
        tipo: "AEI",
        hijos: [
          {
            id: 6,
            codigo: "IP.03",
            nombre: "Aulas renovadas",
            tipo: "IP",
            hijos: []
          }
        ]
      }
    ]
  }
];


export const IndicadoresConfig = () => {
  
  const [ indicadores, setIndicadores ] = useState( indicadoresIniciales );

  function moveIndicador( idArrastrado, idDestino ) {
    // 1. Extraer el nodo arrastrado y quitarlo de su padre actual
    let nodoArrastrado = null;

    function extraerNodo( nodos ) {
      return nodos.filter( nodo => {
        if ( nodo.id === idArrastrado ) {
          nodoArrastrado = nodo;
          return false; // lo quitamos
        }
        if ( nodo.hijos && nodo.hijos.length > 0 ) {
          nodo.hijos = extraerNodo( nodo.hijos );
        }
        return true;
      } );
    }

    const arbolSinArrastrado = extraerNodo( [ ...indicadores ] );

    // Si no se encontró el nodo, no hacemos nada
    if ( !nodoArrastrado ) return;

    // 2. Insertar el nodo como hijo del destino
    function insertarNodo( nodos ) {
      return nodos.map( nodo => {
        if ( nodo.id === idDestino ) {
          return {
            ...nodo,
            hijos: [ ...nodo.hijos, nodoArrastrado ]
          };
        }
        if ( nodo.hijos && nodo.hijos.length > 0 ) {
          return {
            ...nodo,
            hijos: insertarNodo( nodo.hijos )
          };
        }
        return nodo;
      } );
    }

    const nuevoArbol = insertarNodo( arbolSinArrastrado );

    // 3. Actualizar el estado con el nuevo árbol
    setIndicadores( nuevoArbol );
  }
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-50 min-h-screen w-full">
      <h2 className="text-2xl font-bold mb-6">Árbol de Indicadores</h2>
      <div className="w-full border border-red-600 flex flex-col p-4 rounded-lg shadow-md">
        <div className="flex w-full border gap-5">
          { indicadores.length === 0
            ? <span className="text-muted-foreground text-sm">No hay indicadores registrados</span>
            : <DndProvider backend={ HTML5Backend }>
              {/* Aquí va tu renderizado del árbol */ }
              { indicadores.map( indicador =>
                <RenderIndicadorArbol key={ indicador.id } indicador={ indicador } moveIndicador={ moveIndicador } />
              ) }
            </DndProvider>
          }
        </div>
      </div>
    </div>
  );
};