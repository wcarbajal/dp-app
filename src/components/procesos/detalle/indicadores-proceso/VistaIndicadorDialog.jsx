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
import { Button } from "@/components/ui/button";
import { Eye } from "tabler-icons-react";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { IndicadorPdf } from "@/components/pdf-view/IndicadorPdf";
import { Download } from "tabler-icons-react";

export const VistaIndicadorDialog = ({ proceso, indicador }) => {

  console.log("Indicador", indicador)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="">
          <Eye color="black" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent 
        className="h-[95vh] w-[90vw] max-w-none overflow-auto"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Vista PDF - {indicador?.nombre}</AlertDialogTitle>
          <AlertDialogDescription>
            Visualización del indicador en formato PDF
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex-1 overflow-auto border border-gray-200 rounded">
          <PDFViewer 
            width="100%" 
            height={500}
            style={{
              overflow: 'auto',
              scrollbarWidth: 'auto',
              scrollbarColor: 'auto',
              border: 'none'
            }}
          >
            <IndicadorPdf proceso={proceso} indicador={indicador} />
          </PDFViewer>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <PDFDownloadLink
            document={<IndicadorPdf indicador={indicador} />}
            fileName={`indicador-${indicador?.nombre?.replace(/\s+/g, '-')?.toLowerCase() || 'sin-nombre'}.pdf`}
          >
            {({ loading }) => (
              <Button
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                {loading ? 'Generando...' : 'Descargar PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

{/*  */ }