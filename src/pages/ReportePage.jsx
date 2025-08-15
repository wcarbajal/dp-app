import { FichaPdf } from '@/components/pdf-view/FichaPdf';
import { PDFViewer } from '@react-pdf/renderer';


export const ReportePage = () => {
  return (

    <>

      <PDFViewer width="100%" height={ 600 }>
        <FichaPdf />
      </PDFViewer>

    </>
  );
};