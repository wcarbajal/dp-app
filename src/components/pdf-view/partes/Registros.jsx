import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  fila: {
    display: "flex",
    flexDirection: "row",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderColor: "black",
    marginVertical: 0,
    fontSize: 10,
    
  },
  cellTitulo: {
    width: "18%",
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    borderColor: "black",
   textAlign: "left",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  cellContenido: {
    width: "82%",
    padding: 5,    
    borderBottomWidth: 0,
    borderColor: "black",
    textAlign: "left",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  }  
} );

export const Registros = ( { registros } ) => {

  

  let registrosLists = "";
  if ( registros && registros.length > 0 ) {
    registrosLists = registros.map( ( r ) => "- " + r.denominacion ).join( "\n " );
  }

 

  return (
    <View style={ styles.fila }>
      <View style={ styles.cellTitulo }>
        <Text style={ styles.textoContenido }>Registros</Text>
      </View>
      <View style={ styles.cellContenido }>
        <Text style={ styles.textoContenido }>{ registrosLists }</Text>
      </View>
    </View> );
};