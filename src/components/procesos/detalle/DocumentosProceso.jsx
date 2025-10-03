import { Button } from "@/components/ui/button";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, Suspense } from "react";

import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ProcedimientoPdf } from '@/components/pdf-view/ProcedimientoPdf';
import { FichaPdf } from '@/components/pdf-view/FichaPdf';

export const DocumentosProceso = ( { proceso } ) => {
  
  const [pdfError, setPdfError] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const esFicha = proceso?.hijos?.length > 0;

  
  const renderPdfComponent = () => {
    try {
      return esFicha
        ? <FichaPdf proceso={ proceso } />
        : <ProcedimientoPdf proceso={ proceso } />;
    } catch (error) {
      console.error("Error rendering PDF:", error);
      setPdfError(error.message);
      return null;
    }
  };

  if (pdfError) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Documentos del Proceso</h1>
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-red-600">Error al generar el PDF: {pdfError}</p>
          <p className="text-sm text-red-500 mt-2">
            Verifique que todos los datos del proceso estén completos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Documentos del Proceso</h1>
      <div className="flex flex-col gap-4">
        <PDFDownloadLink
          document={renderPdfComponent()}
          fileName={`${proceso?.codigo || 'proceso'}-${esFicha ? 'ficha' : 'procedimiento'}.pdf`}
        >
          { ( { loading, error } ) => {
            if (error) {
              console.error("Error en PDFDownloadLink:", error);
              return (
                <Button variant="destructive" disabled>
                  Error al generar PDF
                </Button>
              );
            }
            
            return (
              <Button variant="outline" disabled={ loading }>
                { loading ? "Generando PDF..." : `Descargar ${esFicha ? 'Ficha' : 'Procedimiento'}` }
              </Button>
            );
          }}
        </PDFDownloadLink>

        <Button 
          variant="secondary" 
          onClick={() => setShowPdf(!showPdf)}
        >
          {showPdf ? "Ocultar Vista Previa" : "Mostrar Vista Previa"}
        </Button>
        
        {showPdf && (
          <div className="border rounded-md overflow-hidden">
            <Suspense fallback={<div className="p-4 text-center">Cargando PDF...</div>}>
              <PDFViewer width="100%" height={ 600 }>
                {renderPdfComponent()}
              </PDFViewer>
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};