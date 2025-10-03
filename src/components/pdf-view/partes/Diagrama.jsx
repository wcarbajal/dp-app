import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  titulo: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",    
    marginVertical: 10,
    fontSize: 10,
    flexDirection: "column",
  },
  imagen: {
    width: 500, // ajusta el tamaño según lo necesites
    height: 400,
    marginVertical: 10,
  },

} );


export const Diagrama = ( { imgBase64 } ) => {

  // Validar si la imagen es válida
  const isValidImage = imgBase64 && 
    (imgBase64.startsWith('data:image/') || 
     imgBase64.startsWith('http') || 
     imgBase64.startsWith('/'));

  return (
    <View>
      <View wrap={ false }>
        <Text style={styles.titulo}>Diagrama de interacción de proceso</Text>

        <View style={ styles.table }>
          {isValidImage ? (
            <Image
              style={ styles.imagen }
              src={ imgBase64 }
            />
          ) : (
            <View style={{ 
              ...styles.imagen, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: '#f5f5f5'
            }}>
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