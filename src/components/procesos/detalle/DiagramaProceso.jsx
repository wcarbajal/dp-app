import { fetchConToken } from '@/helpers/fetch';
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FiMaximize2, FiZoomIn, FiZoomOut } from "react-icons/fi";

export const DiagramaProceso = ( { proceso } ) => {

  const [ url, seturl ] = useState( proceso?.diagrama?.url );
  const fileInputRef = useRef();
  const [ openDialog, setOpenDialog ] = useState( false );
  const [ zoom, setZoom ] = useState( 1 );


  console.log( { zoom } );

  useEffect( () => {
    const baseUrl = proceso?.diagrama?.url;
    seturl( baseUrl ? baseUrl + "?t=" + Date.now() : "" );
  }, [ proceso ] );

  const handleFileChange = async ( e ) => {
    const file = e.target.files[ 0 ];
    if ( !file ) return;

    const onActualizarDiagrama = async ( file ) => {
      if ( !file ) return null;

      const formData = new FormData();
      formData.append( "diagrama", file );

      try {
        const imageResult = await fetchConToken( `procesos/actualizar-diagrama/${ proceso.id }`, formData, "POST" );
        return imageResult;
      } catch ( error ) {
        console.error( "Error al actualizar el diagrama:", error );
        return null;
      }
    };

    if ( onActualizarDiagrama ) {
      const result = await onActualizarDiagrama( file );
      if ( result?.url ) {
        seturl( result.url + "?t=" + Date.now() );
      }
    }
  };


  const handleZoomIn = () => setZoom( z => Math.min( z + 0.1, 1.5 ) );
  const handleZoomOut = () => setZoom( z => Math.max( z - 0.1, 0.8 ) );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-0 relative">
      {/* Botón para ver imagen en pantalla completa */ }
      <Dialog open={ openDialog } onOpenChange={ setOpenDialog } className="">
        <DialogTrigger asChild>
          <button
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow border border-gray-200"
            title="Ver imagen en pantalla completa"
            type="button"
            style={ { display: url ? "block" : "none" } }
          >
            <FiMaximize2 size={ 22 } />
          </button>
        </DialogTrigger>
        <DialogContent
          style={ {

            width: "95vw",
            height: "95vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            padding: 0,
            margin: 0,
            background: "#fff",
            borderRadius: "0.5rem",
            border:"none",

            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          } }
          className=" rounded-lg bg-red "
        >
          { url && (
            <div className="relative flex flex-col items-center justify-center w-full h-full overflow-auto">
              <div className="absolute top-2 left-2 flex gap-2 z-20">
                <button
                  onClick={ handleZoomIn }
                  disabled={ zoom >= 5 }
                  className="bg-white/80 hover:bg-white rounded-full p-2 shadow border border-gray-200"
                  title="Acercar"
                  type="button"
                >
                  <FiZoomIn size={ 20 } />
                </button>
                <button
                  onClick={ handleZoomOut }
                  disabled={ zoom <= 0.2 }
                  className="bg-white/80 hover:bg-white rounded-full p-2 shadow border border-gray-200"
                  title="Alejar"
                  type="button"
                >
                  <FiZoomOut size={ 20 } />
                </button>
                <button
                  onClick={ () => window.open( url, "_blank" ) || window.print() }
                  className="bg-white/80 hover:bg-white rounded-full p-2 shadow border border-gray-200"
                  title="Imprimir"
                  type="button"
                >
                  max / 🖨️
                </button>
              </div>
              <img
                src={ url }
                alt={ `Diagrama de ${ proceso?.nombre }` }
                className="object-contain"
                style={ {
                  width: `${ 900 * zoom }px`,
                  height: `${ 800 * zoom }px`,
                  background: "#f3f4f6",
                  transition: "width 0.1s, height 0.1s",
                  border: "none"
                } }
                draggable={ false }
              />
            </div>
          ) }
        </DialogContent>
      </Dialog>

      <img
        src={ url || null }
        alt={ `Diagrama de ${ proceso?.nombre }` }
        className="object-contain border-2 rounded-xl"
        style={ {
          maxHeight: "90%",
          maxWidth: "90%",
          minHeight: "300px",
          minWidth: "400px",
          background: "#f3f4f6"
        } }
      />
      <button
        className="my-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
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