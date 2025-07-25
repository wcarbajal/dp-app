export const DescripcionProceso = ( { proceso } ) => {
  return (
    <>
      <div>DescripcionProceso</div>
    
      <pre>{ JSON.stringify( proceso, null, 2 ) }</pre>
    </>
  );
};