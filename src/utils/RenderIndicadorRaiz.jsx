import { useDrop } from 'react-dnd';

export function RenderIndicadoresRaiz({ indicadores, moveIndicador }) {
  const [, dropRef] = useDrop({
    accept: "INDICADOR",
    drop: (item) => {
      // Si el indicador arrastrado ya está en el root, no hagas nada
      if (indicadores.some(ind => ind.id === item.id)) return;
      moveIndicador(item.id, null); // null indica nivel raíz
    },
  });

  return (
    <div ref={dropRef} className="flex flex-row gap-4 w-full justify-center">
      {indicadores.map(indicador => (
        <RenderIndicadorArbol
          key={indicador.id}
          indicador={indicador}
          moveIndicador={moveIndicador}
        />
      ))}
    </div>
  );
}