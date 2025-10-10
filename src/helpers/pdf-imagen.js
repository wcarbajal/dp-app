

export const getDimensionImagen = ( imgBase64 ) => {

  if ( !imgBase64 ) {
    
    return { width: 1, height: 1.4 }; // default portrait (más alto que ancho)
  }  

  // Detectar el tipo de imagen
  if ( imgBase64.includes( 'data:image/svg' ) || imgBase64.includes( 'svg' ) ) {
    

    // Lógica para SVG
    try {
      let svgString;

      if ( imgBase64.startsWith( 'data:' ) ) {
        const base64Data = imgBase64.split( ',' )[ 1 ];
        svgString = atob( base64Data );
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

      for ( const pattern of patterns.viewBox ) {
        viewBoxMatch = svgString.match( pattern );
        if ( viewBoxMatch ) break;
      }

      for ( const pattern of patterns.width ) {
        widthMatch = svgString.match( pattern );
        if ( widthMatch ) break;
      }

      for ( const pattern of patterns.height ) {
        heightMatch = svgString.match( pattern );
        if ( heightMatch ) break;
      }

      let width, height;

      if ( widthMatch && heightMatch ) {
        width = parseFloat( widthMatch[ 1 ] );
        height = parseFloat( heightMatch[ 1 ] );

      } else if ( viewBoxMatch ) {
        const viewBoxValues = viewBoxMatch[ 1 ].split( /[\s,]+/ );
        if ( viewBoxValues.length >= 4 ) {
          width = parseFloat( viewBoxValues[ 2 ] );
          height = parseFloat( viewBoxValues[ 3 ] );

        }
      }

      if ( width && height && width > 0 && height > 0 ) {

        return { width, height };
      }
    } catch ( error ) {
      console.error( 'Error parsing SVG dimensions:', error );
    }
  }
  else if ( imgBase64.includes( 'data:image/png' ) || imgBase64.includes( 'png' ) ) {

    
    const base64Length = imgBase64.length;
    

    // Intentar detectar dimensiones reales del PNG
    try {
      if (imgBase64.startsWith('data:image/png;base64,')) {
        const base64Data = imgBase64.split(',')[1];
        const binaryString = atob(base64Data);
        
        // Los PNG tienen las dimensiones en los primeros bytes después del header
        // Bytes 16-19: width, Bytes 20-23: height
        if (binaryString.length >= 24) {
          const width = (binaryString.charCodeAt(16) << 24) + 
                       (binaryString.charCodeAt(17) << 16) + 
                       (binaryString.charCodeAt(18) << 8) + 
                       binaryString.charCodeAt(19);
          
          const height = (binaryString.charCodeAt(20) << 24) + 
                        (binaryString.charCodeAt(21) << 16) + 
                        (binaryString.charCodeAt(22) << 8) + 
                        binaryString.charCodeAt(23);
          
          if (width > 0 && height > 0) {
            
            return { width, height };
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error detectando dimensiones PNG reales:', error);
    }

    // Fallback: usar estimaciones basadas en tamaño
    if ( base64Length < 30000 ) {
      
      return { width: 600, height: 800 }; // Portrait para diagramas muy simples
    } else {
      
      return { width: 1200, height: 800 }; // Landscape para la mayoría de diagramas
    }
  }
  else if ( imgBase64.includes( 'data:image/jpeg' ) || imgBase64.includes( 'data:image/jpg' ) ) {

    return { width: 1000, height: 700 }; // Landscape por defecto para JPEG
  }
  else {
    console.log( '❓ Tipo de imagen no reconocido' );
  }

  // Fallback por defecto

  return { width: 1000, height: 700 }; // Landscape por defecto para diagramas
};


export const getOrientacionPagina = ( imgBase64, factor = 1.1 ) => {

  if ( !imgBase64 ) return 'portrait';

  const dimensions = getDimensionImagen( imgBase64 );

  const ratioAnchoAlto = dimensions.width / dimensions.height;

  // Solo girar a landscape si la imagen es significativamente más ancha que alta
  if ( ratioAnchoAlto >= factor ) {
    
    return 'landscape';
  }
  
  // Para todo lo demás (vertical o cuadrado), mantener portrait
   return 'portrait';
};
