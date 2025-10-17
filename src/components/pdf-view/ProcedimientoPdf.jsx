
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Cabecera } from './partes/Cabecera';
import { ProcedimientoList } from './partes/ProcedimientoList';
import { Diagrama } from './partes/Diagrama';




const styles = StyleSheet.create( {
  page: { padding: 30 },
  contenedorTitulo: { display: 'flex', flexDirection: 'row', alignItems: 'center', border: '1pt solid #eee' },
  seccionTituloIz: { backgroundColor: '#f5f5f5', border: '1pt solid #eee', width: '25%' },
  seccionTituloCentro: { width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  seccionTituloDer: { border: '1pt solid #eee', width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 9, },
  cabeceraDerecha: { backgroundColor: '#D9D9D9', width: '100%', height: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  subtitulo: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: 'bold'}

} );

export const ProcedimientoPdf = ( { proceso } ) => {

  
  const { codigo, nombre, version, actividades } = proceso || {};

  // Validar y limpiar la imagen
  let imgBase64 = "";
  if ( proceso?.diagrama?.url ) {
    const url = proceso.diagrama.url;
    // Verificar si es base64 o una URL válida
    if ( url.startsWith( 'data:image/' ) ) {
      imgBase64 = url;
    } else if ( url.startsWith( 'http' ) || url.startsWith( '/' ) ) {
      // Es una URL normal, intentar convertir o usar directamente
      imgBase64 = url;
    }
  }


  return (
    <Document>
      <Page size="A4" style={ styles.page }>
        <Cabecera
          imagen="/img/MINEDU.png"
          titulo="Procedimiento de proceso"
          codigoFormato="FPE03.02.01"
          version="2"
        />
        <View style={ styles.subtitulo }>
          <Text >Procedimiento</Text>
        </View>
        <ProcedimientoList codigo={ codigo } listaActividades={ actividades } nombre={ nombre } version={ version } />

     

        <Diagrama imgBase64={ imgBase64 } />
      </Page>
    </Document>
  );
};