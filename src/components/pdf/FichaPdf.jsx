
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Cabecera } from './partes/Cabecera';
import { Idetificacion } from './partes/Idetificacion';


const styles = StyleSheet.create( {
  page: { padding: 30 },
  contenedorTitulo: { display: 'flex', flexDirection: 'row', alignItems: 'center', border: '1pt solid #eee' },
  seccionTituloIz: { backgroundColor: '#f5f5f5', border: '1pt solid #eee', width: '25%' },
  seccionTituloCentro: { width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  seccionTituloDer: { border: '1pt solid #eee', width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 9, },
  cabeceraDerecha: { backgroundColor: '#D9D9D9', width: '100%', height: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }

} );

export const FichaPdf = () => {




  return (
    <Document>
      <Page size="A4" style={ styles.page }>
       <Cabecera
         imagen="img/MINEDU.png"
         titulo="Ficha de proceso"
         codigoFormato="FPE03.02.01"
         version="2"
       />

       <Idetificacion />
      </Page>
    </Document>
  );
};