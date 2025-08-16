import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    borderRightWidth: 0,
    borderBottomWidth: 0, 
    marginVertical: 10,
    fontSize: 10,
    flexDirection: "column",
  },
  cellCabecera: {
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "black",
    backgroundColor: "#f0f0f0",
  },
  rowTitulo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cellTitulo: {
    width: "50%",
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: "#f0f0f0",
  },
  cellTituloLast: {
    borderRightWidth: 1,
  },
  rowContenido: {
    flexDirection: "row",
    alignItems: "center",
  },
  cellContenido: {
    width: "50%",
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: "#fff",
  },
  cellContenidoLast: {
    borderRightWidth: 0,
  },
  textoTitulo: {
    fontWeight: "bold",
    fontSize: 12,
  },
  textoContenido: {
    fontSize: 10,
  }
});


export const Validacion = () => (

  <View style={ styles.table }>

    <View style={ styles.rowTitulo }>
      <View style={ styles.cellTitulo }>
        <Text>Revisado por:</Text>

      </View>      
      <View style={ [ styles.cellTitulo, styles.cellTituloLast ] }>
        <Text>Aprobado por: </Text>
      </View>
    </View>


    
      <View style={ styles.rowContenido } >
        <View style={ styles.cellContenido }>
          <Text style={ styles.textoContenido }>[FIRMA]</Text>
        </View>
        <View style={ styles.cellContenido }>
          <Text style={ styles.textoContenido }>[FIRMA]</Text>
        </View>
       
      </View>
    



  </View>
);