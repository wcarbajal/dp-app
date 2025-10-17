import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  titulo: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 0,
    fontSize: 10,
    flexDirection: "column",
    padding: 0,
    maxHeight: 337, // 40% de una página A4 (842 * 0.4)
  },
  contenedorImagen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: 300, // Reducido para dejar espacio al header
    backgroundColor: '#f9f9f9',
    padding: 5,
    overflow: 'hidden', // Previene desbordamiento
  },
  imagen: {
    maxWidth: '95%',
    maxHeight: '100%', // Se ajusta al contenedor
    width: 'auto',
    height: 'auto',
    objectFit: 'contain', // Mantiene proporción sin distorsión
  },
  imagenPlaceholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: '100%',
    height: 250, // Ajustado al nuevo límite
    maxHeight: 300,
    border: '1pt dashed #ccc',
  },
  cellCabecera: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: "black",
    backgroundColor: "#f0f0f0",
    
    padding: 5,
  },
  textoTitulo: {
    fontWeight: "bold",
    fontSize: 10,
  }
} );


export const Diagrama = ( { imgBase64 } ) => {

  // Validar si la imagen es válida
  const isValidImage = imgBase64 &&
    ( imgBase64.startsWith( 'data:image/' ) ||
      imgBase64.startsWith( 'http' ) ||
      imgBase64.startsWith( '/' ) );

  return (
    

      <View style={ styles.table }>
        <View style={ styles.cellCabecera }>
          <Text style={ styles.textoTitulo }>Diagrama de proceso</Text>
        </View>
        { isValidImage ? (
          <View style={ styles.contenedorImagen }>
            <Image
              style={ styles.imagen }
              src={ imgBase64 }
            />
          </View>
        ) : (
          <View style={ styles.imagenPlaceholder }>
            <Text style={ { fontSize: 10, color: '#666' } }>
              Diagrama no disponible
            </Text>
          </View>
        ) }
      </View>
    
  );
};