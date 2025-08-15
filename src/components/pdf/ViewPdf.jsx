import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Pdfdocument } from './Pdfdocument';
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