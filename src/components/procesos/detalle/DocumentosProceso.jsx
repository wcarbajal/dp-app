import { Button } from "@/components/ui/button";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ProcedimientoPdf } from '@/components/pdf-view/ProcedimientoPdf';
import { FichaPdf } from '@/components/pdf-view/FichaPdf';



export const DocumentosProceso = ( { proceso } ) => {

   return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Documentos del Proceso</h1>
      <Tabs defaultValue="ficha" className="w-full flex flex-col justify-center">
        <TabsList className="w-full  ">
          <TabsTrigger value="ficha" >Ficha</TabsTrigger>
          <TabsTrigger value="procedimiento">Procedimiento</TabsTrigger>
        </TabsList>
        <TabsContent value="ficha">
          {/* Puedes agregar aquí un formulario de filtro si lo necesitas */ }
          <div className="flex flex-col gap-4 mb-2">
            <PDFDownloadLink
              document={ <FichaPdf proceso={ proceso }  /> }
              fileName="FichaProceso.pdf"
            >
              { ( { loading } ) => (
                <Button variant="outline" disabled={ loading }>
                  { loading ? "Generando Ficha..." : "Descargar Ficha PDF" }
                </Button>
              ) }
            </PDFDownloadLink>
          </div>
          <PDFViewer width="100%" height={ 600 }>
            <FichaPdf />
          </PDFViewer>

        </TabsContent>
        <TabsContent value="procedimiento">
          <div className="flex flex-col gap-4">
            <PDFDownloadLink
              document={ <ProcedimientoPdf proceso={ proceso }  /> }
              fileName="ProcedimientoProceso.pdf"
            >
              { ( { loading } ) => (
                <Button variant="outline" disabled={ loading }>
                  { loading ? "Generando Procedimiento..." : "Descargar Procedimiento PDF" }
                </Button>
              ) }
            </PDFDownloadLink>
            <PDFViewer width="100%" height={ 600 }>
              <FichaPdf />
            </PDFViewer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
