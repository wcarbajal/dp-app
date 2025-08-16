
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Cabecera } from './partes/Cabecera';
import { Identificacion } from './partes/Identificacion';
import { Descripcion } from './partes/Descripcion';
import { Indicadores } from './partes/Indicadores';
import { Validacion } from './partes/Validacion';
import { Diagrama } from './partes/Diagrama';
import { useEffect, useState } from 'react';
import { fetchConToken } from '@/helpers/fetch';



const styles = StyleSheet.create( {
  page: { padding: 30 },
  contenedorTitulo: { display: 'flex', flexDirection: 'row', alignItems: 'center', border: '1pt solid #eee' },
  seccionTituloIz: { backgroundColor: '#f5f5f5', border: '1pt solid #eee', width: '25%' },
  seccionTituloCentro: { width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  seccionTituloDer: { border: '1pt solid #eee', width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 9, },
  cabeceraDerecha: { backgroundColor: '#D9D9D9', width: '100%', height: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  subtitulo: { display: 'flex', justifyContent: 'center', alignItems: 'center' }

} );

export const FichaPdf = ( { procesoId = 1 } ) => {

  const [ imgBase64, setImgBase64 ] = useState( "" );
  console.log( 'Proceso ID:', procesoId );
  console.log( 'Imagen Base64:', imgBase64 );

  useEffect(() => {

    const fetchImage = async () => {
      try {
        const response = await fetchConToken( `procesos/${procesoId}/imagen-diagrama-64` );
        console.log( 'Response:', response);
        //const data = await response.json();
        setImgBase64( response.base64 );
      } catch ( error ) {
        console.error( 'Error fetching image:', error );
      }
    };

    fetchImage();
  }, [procesoId]);


  return (
    <Document>
      <Page size="A4" style={ styles.page }>
        <Cabecera
          imagen="img/MINEDU.png"
          titulo="Ficha de proceso"
          codigoFormato="FPE03.02.01"
          version="2"
        />

        <Identificacion />
        <Descripcion />
        <Indicadores />
        <Validacion />

        {imgBase64 && <Diagrama imgBase64={imgBase64} />}

      </Page>
    </Document>
  );
};