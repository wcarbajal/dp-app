import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Cabecera } from './partes/Cabecera';
import { Identificacion } from './partes/Identificacion';
import { Descripcion } from './partes/Descripcion';
import { Indicadores } from './partes/Indicadores';
import { Validacion } from './partes/Validacion';
import { Diagrama } from './partes/Diagrama';
import { Riesgos } from './partes/Riesgos';
import { Registros } from './partes/Registros';
//import { getOrientacionPagina } from '@/helpers/pdf-imagen';



const styles = StyleSheet.create( {
  page: { padding: 30 },
  contenedorTitulo: { display: 'flex', flexDirection: 'row', alignItems: 'center', border: '1pt solid #eee' },
  seccionTituloIz: { backgroundColor: '#f5f5f5', border: '1pt solid #eee', width: '25%' },
  seccionTituloCentro: { width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  seccionTituloDer: { border: '1pt solid #eee', width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 9, },
  cabeceraDerecha: { backgroundColor: '#D9D9D9', width: '100%', height: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  subtitulo: { display: 'flex', justifyContent: 'center', alignItems: 'center' }

} );

export const FichaPdf = ( { proceso } ) => {

  let imgBase64 = "";
  //let hasValidDiagram = false;
  
  if (proceso?.diagrama?.url) {

    const url = proceso.diagrama.url;
    
    // Verificar si es base64 o una URL válida y no está vacía
    if (url && url.length > 10) { // Mínimo 10 caracteres para ser una URL válida
      if (url.startsWith('data:image/')) {
        imgBase64 = url;
       // hasValidDiagram = true;
        
      } else if (url.startsWith('http') || url.startsWith('/')) {
        imgBase64 = url;
      //  hasValidDiagram = true;
        
      }
    } else {
      console.log('❌ URL del diagrama no válida o muy corta');
    }
  } else {
    console.log('❌ No hay proceso.diagrama.url');
  }


  return (
    <Document>
      <Page size="A4" style={ styles.page }>
        <Cabecera
          imagen="/img/MINEDU.png"
          titulo="Ficha de proceso"
          codigoFormato="FPE03.02.01"
          version="2"
        />

        <Identificacion proceso={ proceso } />
        <Descripcion inputOutput={ proceso.ficha.inputOutput } />
        <Diagrama imgBase64={imgBase64} />
        <Riesgos riesgos={ proceso.ficha.riesgos } />
        <Registros registros={ proceso.ficha.registros } />
        <Validacion owner={ proceso?.owners[0]?.unidadOperativa?.nombre } />
      </Page>

      {/* Página dedicada al diagrama - solo si hay diagrama válido */}
    {/*   {hasValidDiagram && imgBase64 && imgBase64.length > 0 && (
        <Page 
          size="A4" 
          orientation={diagramPageOrientation}
          style={styles.page}
        >
          <Diagrama imgBase64={imgBase64} />
        </Page>
      )} */}
    </Document>
  );
};