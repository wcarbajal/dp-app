import { useRef, useState } from "react";

export const DiagramaProceso = ( { proceso, onActualizarDiagrama } ) => {

  const [ url, seturl ] = useState( proceso?.detalleProceso?.diagramaRelacion?.url );
  const fileInputRef = useRef();

  console.log( proceso?.detalleProceso?.diagramaRelacion?.url, "URL del diagrama" );



  const handleFileChange = async ( e ) => {
    const file = e.target.files[ 0 ];
    if ( !file ) return;

    if ( onActualizarDiagrama ) {
      const result = await onActualizarDiagrama( file );
      if ( result?.url ) {
        seturl( result.url + "?t=" + Date.now() );
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <img
        src={ url }
        alt={ `Diagrama de ${ proceso?.nombre }` }
        className="w-full h-full max-h-[400px] object-contain border rounded"
        style={ { maxHeight: "100%", maxWidth: "100%" } }
      />
      <button
        className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        onClick={ () => fileInputRef.current.click() }
      >
        Actualizar diagrama
      </button>
      <input
        ref={ fileInputRef }
        type="file"
        accept="image/*"
        className="hidden"
        onChange={ handleFileChange }
      />
    </div>
  );
};