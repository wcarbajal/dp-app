
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Cabecera } from './partes/Cabecera';
import { Identificacion } from './partes/Identificacion';
import { Descripcion } from './partes/Descripcion';
import { Indicadores } from './partes/Indicadores';
import { Validacion } from './partes/Validacion';
import { Diagrama } from './partes/Diagrama';


// Función para detectar si una imagen es más ancha que alta
const getImageDimensions = (imgBase64) => {
  if (!imgBase64 || typeof window === 'undefined') {
    return { width: 1, height: 1 }; // default portrait
  }

  // Para imágenes base64, intentamos extraer las dimensiones del SVG si es posible
  if (imgBase64.includes('data:image/svg')) {
    // Si es SVG, podemos intentar parsearlo para obtener dimensiones
    try {
      const base64Data = imgBase64.split(',')[1];
      const svgString = atob(base64Data);
      const widthMatch = svgString.match(/width="([^"]+)"/);
      const heightMatch = svgString.match(/height="([^"]+)"/);
      
      if (widthMatch && heightMatch) {
        const width = parseFloat(widthMatch[1]);
        const height = parseFloat(heightMatch[1]);
        return { width, height };
      }
    } catch (error) {
      console.warn('Error parsing SVG dimensions:', error);
    }
  }

  // Para otros tipos de imagen, usamos dimensiones más conservadoras
  // Solo asumimos landscape si realmente es muy horizontal
  return { width: 1.2, height: 1 }; // Relación 1.2:1 - no alcanza el umbral de 1.5
};





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

    // Validar y limpiar la imagen
  let imgBase64 = "";
  if (proceso?.diagrama?.url) {
    const url = proceso.diagrama.url;
    // Verificar si es base64 o una URL válida
    if (url.startsWith('data:image/')) {
      imgBase64 = url;
    } else if (url.startsWith('http') || url.startsWith('/')) {
      // Es una URL normal, intentar convertir o usar directamente
      imgBase64 = url;
    }
  }

  // Determinar orientación de la página para el diagrama
  const getPageOrientation = () => {
    if (!imgBase64) return 'portrait';
    
    const dimensions = getImageDimensions(imgBase64);
    // Solo girar a horizontal si el ancho es al menos 1.1 veces mayor que la altura
    const aspectRatio = dimensions.width / dimensions.height;
    return aspectRatio >= 1.1 ? 'landscape' : 'portrait';
  };

  const diagramPageOrientation = getPageOrientation();



  return (
    <Document>
      <Page size="A4" style={ styles.page }>
        <Cabecera
          imagen="/img/MINEDU.png"
          titulo="Ficha de proceso"
          codigoFormato="FPE03.02.01"
          version="2"
        />

        <Identificacion />
        <Descripcion />
        <Indicadores />
        <Validacion />
      </Page>

      {/* Página dedicada al diagrama con orientación dinámica */}
      {imgBase64 && (
        <Page 
          size="A4" 
          orientation={diagramPageOrientation}
          style={styles.page}
        >
          <Diagrama imgBase64={imgBase64} />
        </Page>
      )}
    </Document>
  );
};