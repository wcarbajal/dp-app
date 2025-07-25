export const DiagramaProceso = ({ proceso }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={ proceso?.detalleProceso?.diagramaRelacion?.url }
        alt={ `Diagrama de ${ proceso?.nombre }` }
        className="w-full h-full object-contain"
        style={ { maxHeight: "100%", maxWidth: "100%" } }
      />
    </div>
  );
};