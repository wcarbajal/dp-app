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
    marginVertical: 5,
    fontSize: 10,
    flexDirection: "column",
    padding: 5,
  },
  contenedorImagen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: 400,
    backgroundColor: '#f9f9f9',
    padding: 5,
  },
  imagen: {
    maxWidth: '90%',
    maxHeight: '390px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
  },
  imagenPlaceholder: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: '100%',
    height: 200,
    border: '1pt dashed #ccc',
  }
} );


export const Diagrama = ( { imgBase64 } ) => {

  // Validar si la imagen es válida
  const isValidImage = imgBase64 && 
    (imgBase64.startsWith('data:image/') || 
     imgBase64.startsWith('http') || 
     imgBase64.startsWith('/'));

  return (
    <View>
      <Text style={styles.titulo}>Diagrama de interacción de proceso</Text>
      <View style={ styles.table }>
        {isValidImage ? (
          <View style={styles.contenedorImagen}>
            <Image
              style={styles.imagen}
              src={imgBase64}
            />
          </View>
        ) : (
          <View style={styles.imagenPlaceholder}>
            <Text style={{ fontSize: 10, color: '#666' }}>
              Diagrama no disponible
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};