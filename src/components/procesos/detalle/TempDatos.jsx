export const TempDatos = ({proceso}) => {
  return (
    <pre>
      {
        JSON.stringify( proceso, null, 2 )
      }
    </pre>
  );
};