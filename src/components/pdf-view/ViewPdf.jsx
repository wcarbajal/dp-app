import { PDFViewer } from '@react-pdf/renderer';
import { FichaPdf } from './FichaPdf';



export const ViewPdf = () => {

  /* const datos = [ 'Uno', 'Dos', 'Tres' ]; */
  return (

    <>

      <PDFViewer width="100%" height={ 600 }>
        <FichaPdf  />
      </PDFViewer>

    </>
  );
};