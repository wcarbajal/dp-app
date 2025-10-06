import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  titulo: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    display: "flex",
    width: "100%", // Cambiado de "auto" a "100%"
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",    
    marginVertical: 10,
    fontSize: 10,
    flexDirection: "column",
    padding: 5,
    overflow: "hidden", // Evita desbordamiento
  },
  contenedorImagen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto', // Altura automática
    minHeight: 400,
    maxHeight: 650, // Altura máxima fija para evitar desbordamiento
    backgroundColor: '#f9f9f9',
    padding: 10, // Padding para evitar que toque los bordes
  },
  imagen: {
    maxWidth: '95%', // Reducido para dejar margen
    maxHeight: '95%', // Reducido para dejar margen
    width: 'auto',
    height: 'auto',
    objectFit: 'contain', // Mantiene la proporción sin distorsión
  },
  imagenPlaceholder: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: '100%',
    height: 400, // Altura fija más conservadora
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
    <View style={{ marginTop: 15, width: '100%', maxWidth: '100%' }}>
      <View wrap={ false } style={{ width: '100%' }}>
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
    </View>
  );
};