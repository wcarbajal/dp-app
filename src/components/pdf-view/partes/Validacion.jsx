import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    borderRightWidth: 0,
    borderBottomWidth: 0,
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
    
    
  },
  cellContenido: {
    
    height: 90,
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    textAlign: "center",
    
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
    marginTop: 5,
  },
  ajusteColumna1:{
    width: '36.2%',
    borderRighttWidth: "1px",
  },
  ajusteColumna2:{
    width: '32%',
    borderRighttWidth: "1px",
  },
  ajusteColumna3:{
    width: '32%',
  },
  
} );


export const Validacion = ( { owner } ) => (

  
  <View style={ styles.table }>

    <View style={ styles.rowTitulo }>
      <View style={ [styles.cellTitulo, styles.ajusteColumna1] }>
        <Text>Elaborado por:</Text>

      </View>
      <View style={ [styles.cellTitulo, styles.ajusteColumna2] }>
        <Text>Revisado por:</Text>

      </View>
      <View style={ [ styles.cellTitulo, styles.cellTituloLast, styles.ajusteColumna3 ] }>
        <Text>Aprobado por: </Text>
      </View>
    </View>


    <View style={ styles.rowContenido } >

      <View style={ [ styles.cellContenido, styles.ajusteColumna1 ] } >
        <Text style={ styles.textoContenido }>{ owner }</Text>
        <Text style={ styles.textoContenido }></Text>
        
      </View>
      <View style={ [ styles.cellContenido, styles.ajusteColumna2 ] }>
        <Text style={ styles.textoContenido }>Unidad de Modernización de la Gestión</Text>
        <Text style={ styles.textoContenido }></Text>
      </View>
      <View style={ [ styles.cellContenido, styles.ajusteColumna3 ] }>
        <Text style={ styles.textoContenido }>{ owner }</Text>        
        <Text style={ styles.textoContenido }></Text>
      </View>

    </View>




  </View>
);