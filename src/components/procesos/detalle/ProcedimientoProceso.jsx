export const ProcedimientoProceso = ({ proceso }) => {
  return (
    <div>
      <h3>Procedimiento del Proceso</h3>
      <pre>{ JSON.stringify( proceso, null, 2 ) }</pre>
    </div>
  )
}