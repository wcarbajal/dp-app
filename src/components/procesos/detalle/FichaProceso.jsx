export const FichaProceso = ({ proceso }) => {
  return (
    <div>
      <h3>Ficha del Proceso</h3>
      <pre>{ JSON.stringify( proceso, null, 2 ) }</pre>
    </div>
  );
}