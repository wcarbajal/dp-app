export const IndicadoresProceso = ({proceso}) => {
  return (
    <div>
      <h3>Indicadores del Proceso</h3>
      <pre>{ JSON.stringify( proceso, null, 2 ) }</pre>
    </div>
  );
}