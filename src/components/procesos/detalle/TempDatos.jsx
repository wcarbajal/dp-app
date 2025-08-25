export const TempDatos = ( { proceso } ) => {
  return (
    <div className="overflow-auto">

      <pre>
        {
          JSON.stringify( proceso, null, 2 )
        }
      </pre>
    </div>
  );
};