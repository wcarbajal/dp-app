import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
  cellCabecera: {
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
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
    borderRightWidth: 0,
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

const datos = [
  [ "Indicador 1", "Formula 1" ],
  [ "Indicador 2", "Formula 2" ],
  [ "Indicador 3", "Formula 3" ],
];

export const Indicadores = () => (

  <View style={ styles.table }>

    <View style={ styles.cellCabecera }>
      <Text style={ styles.textoTitulo }>Descripción del proceso</Text>
    </View>

    <View style={ styles.rowTitulo }>
      <View style={ styles.cellTitulo }>
        <Text>Proveedores</Text>

      </View>      
      <View style={ [ styles.cellTitulo, styles.cellTituloLast ] }>
        <Text>Usuarios</Text>
      </View>
    </View>


    { datos.map( ( fila, idx ) => (
      <View style={ styles.rowContenido } key={ idx }>
        <View style={ styles.cellContenido }>
          <Text style={ styles.textoContenido }>{ fila[ 0 ] }</Text>
        </View>
        <View style={ styles.cellContenido }>
          <Text style={ styles.textoContenido }>{ fila[ 1 ] }</Text>
        </View>
       
      </View>
    ) ) }



  </View>
);