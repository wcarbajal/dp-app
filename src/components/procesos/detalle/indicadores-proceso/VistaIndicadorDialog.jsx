import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye } from "tabler-icons-react";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { IndicadorPdf } from "@/components/pdf-view/IndicadorPdf";
import { Download } from "tabler-icons-react";
import { fetchConToken } from "@/helpers/fetch"; 


export const VistaIndicadorDialog = ( { proceso, indicador } ) => {

  const [ resultados, setResultados ] = useState([]);

  

  const cargarResultados = async (indicadorId) => {

    const response = await fetchConToken( `indicador/resultados/${ indicadorId }`, {}, 'GET' );
    if ( response.ok ) {
      setResultados( response.resultados );
    }
    
  }

  useEffect(  () => {
    cargarResultados(indicador?.id);
   
  }, [indicador?.id])
  

  
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-8 h-8">
              <Eye color="black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver indicador en formato PDF</p>
          </TooltipContent>
        </Tooltip>


      </AlertDialogTrigger>
      <AlertDialogContent
        className="h-[95vh] w-[90vw] max-w-none overflow-auto"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Vista PDF - { indicador?.nombre }</AlertDialogTitle>
          <AlertDialogDescription>
            Visualización del indicador en formato PDF
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex-1 overflow-auto border border-gray-200 rounded">
          <PDFViewer
            width="100%"
            height={ 500 }
            style={ {
              overflow: 'auto',
              scrollbarWidth: 'auto',
              scrollbarColor: 'auto',
              border: 'none'
            } }
          >
            <IndicadorPdf proceso={ proceso } indicador={ indicador } resultados={ resultados } />
          </PDFViewer>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <PDFDownloadLink
            document={ <IndicadorPdf proceso={ proceso } indicador={ indicador } resultados={ resultados } /> }
            fileName={ `indicador-${ indicador?.nombre?.replace( /\s+/g, '-' )?.toLowerCase() || 'sin-nombre' }.pdf` }
          >
            { ( { loading } ) => (
              <Button
                disabled={ loading }
                className="flex items-center gap-2"
              >
                <Download size={ 16 } />
                { loading ? 'Generando...' : 'Descargar PDF' }
              </Button>
            ) }
          </PDFDownloadLink>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

{/*  */ }