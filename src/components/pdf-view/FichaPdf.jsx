import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Cabecera } from './partes/Cabecera';
import { Identificacion } from './partes/Identificacion';
import { Descripcion } from './partes/Descripcion';
import { Indicadores } from './partes/Indicadores';
import { Validacion } from './partes/Validacion';
import { Diagrama } from './partes/Diagrama';


// Función para detectar si una imagen es más ancha que alta
const getImageDimensions = (imgBase64) => {
  
  
  if (!imgBase64) {
    
    return { width: 1, height: 1.4 }; // default portrait (más alto que ancho)
  }

  

  // Detectar el tipo de imagen
  if (imgBase64.includes('data:image/svg') || imgBase64.includes('svg')) {
    
    // Lógica para SVG
    try {
      let svgString;
      
      if (imgBase64.startsWith('data:')) {
        const base64Data = imgBase64.split(',')[1];
        svgString = atob(base64Data);
      } else {
        svgString = imgBase64;
      }
      
      
      
      const patterns = {
        viewBox: [
          /viewBox=["']([^"']*?)["']/,
          /viewBox=(\S+)/,
          /viewBox="([^"]*?)"/,
          /viewBox='([^']*?)'/
        ],
        width: [
          /width=["']([^"']+)["']/,
          /width="([^"]*?)"/,
          /width='([^']*?)'/,
          /<svg[^>]*width["'=\s]*([0-9.]+)/
        ],
        height: [
          /height=["']([^"']+)["']/,
          /height="([^"]*?)"/,
          /height='([^']*?)'/,
          /<svg[^>]*height["'=\s]*([0-9.]+)/
        ]
      };
      
      let viewBoxMatch, widthMatch, heightMatch;
      
      for (const pattern of patterns.viewBox) {
        viewBoxMatch = svgString.match(pattern);
        if (viewBoxMatch) break;
      }
      
      for (const pattern of patterns.width) {
        widthMatch = svgString.match(pattern);
        if (widthMatch) break;
      }
      
      for (const pattern of patterns.height) {
        heightMatch = svgString.match(pattern);
        if (heightMatch) break;
      }
      
      let width, height;
      
      if (widthMatch && heightMatch) {
        width = parseFloat(widthMatch[1]);
        height = parseFloat(heightMatch[1]);
        
      } else if (viewBoxMatch) {
        const viewBoxValues = viewBoxMatch[1].split(/[\s,]+/);
        if (viewBoxValues.length >= 4) {
          width = parseFloat(viewBoxValues[2]);
          height = parseFloat(viewBoxValues[3]);
          
        }
      }
      
      if (width && height && width > 0 && height > 0) {
        
        return { width, height };
      }
    } catch (error) {
      console.error('Error parsing SVG dimensions:', error);
    }
  } 
  else if (imgBase64.includes('data:image/png') || imgBase64.includes('png')) {
    
    
    const base64Length = imgBase64.length;
    
    
    // Para diagramas BPMN, por defecto landscape (son más comunes)
    if (base64Length < 30000) {
    
      return { width: 600, height: 800 }; // Portrait para diagramas muy simples
    } else {
    
      return { width: 1000, height: 700 }; // Landscape para la mayoría de diagramas
    }
  }
  else if (imgBase64.includes('data:image/jpeg') || imgBase64.includes('data:image/jpg')) {
    
    return { width: 1000, height: 700 }; // Landscape por defecto para JPEG
  }
  else {
    console.log('❓ Tipo de imagen no reconocido');
  }

  // Fallback por defecto
  
  return { width: 1000, height: 700 }; // Landscape por defecto para diagramas
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
  let hasValidDiagram = false;
  
  if (proceso?.diagrama?.url) {
    const url = proceso.diagrama.url;

    
    // Verificar si es base64 o una URL válida y no está vacía
    if (url && url.length > 10) { // Mínimo 10 caracteres para ser una URL válida
      if (url.startsWith('data:image/')) {
        imgBase64 = url;
        hasValidDiagram = true;
        
      } else if (url.startsWith('http') || url.startsWith('/')) {
        imgBase64 = url;
        hasValidDiagram = true;
        
      }
    } else {
      console.log('❌ URL del diagrama no válida o muy corta');
    }
  } else {
    console.log('❌ No hay proceso.diagrama.url');
  }

  // Determinar orientación de la página para el diagrama
  const getPageOrientation = () => {
    if (!imgBase64) return 'portrait';
   

    const dimensions = getImageDimensions(imgBase64);

    //const aspectRatio = dimensions.width / dimensions.height;
    
    // Condición: si ancho > 1.1 * alto, usar horizontal
    const esHorizontal = dimensions.width > (1.1 * dimensions.height);
    
    /* console.log('Calculando orientación:', { 
      width: dimensions.width, 
      height: dimensions.height, 
      aspectRatio: aspectRatio.toFixed(2),
      calculo: `${dimensions.width} > (1.1 × ${dimensions.height})`,
      umbral: (1.1 * dimensions.height).toFixed(2),
      comparacion: `${dimensions.width} > ${(1.1 * dimensions.height).toFixed(2)}`,
      anchoMayorQueUmbral: dimensions.width > (1.1 * dimensions.height),
      resultado: esHorizontal ? 'landscape' : 'portrait'
    }); */
    
    return esHorizontal ? 'landscape' : 'portrait';
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

        <Identificacion proceso={ proceso } />
        <Descripcion inputOutput={ proceso.ficha.inputOutput } />
        <Indicadores indicadores={ proceso.indicadores } />
        <Validacion proceso={ proceso } />
      </Page>

      {/* Página dedicada al diagrama - solo si hay diagrama válido */}
      {hasValidDiagram && imgBase64 && imgBase64.length > 0 && (
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