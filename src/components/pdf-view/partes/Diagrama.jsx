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


export const Diagrama = ( { imgBase64 } ) => (

  <View>
    <View wrap={ false }>
      <Text>Diagrama de interaccion de proceso</Text>

      <View style={ styles.table }>
        <Image
          style={ styles.imagen }
          src={ imgBase64 }
          alt="Diagrama de interaccion de proceso"
        />
      </View>
    </View>
  </View>
);