import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderColor: "black",
    marginVertical: 0,
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
    width: "25%",
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
    width: "25%",
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
} );

export const Descripcion = ( { inputOutput } ) => {
  
  

  return (
    <View style={ styles.table }>

    {/*   <View style={ styles.cellCabecera }>
        <Text style={ styles.textoTitulo }>Descripción del proceso</Text>
      </View> */}

      <View style={ styles.rowTitulo }>
        <View style={ styles.cellTitulo }>
          <Text>Proveedores</Text>

        </View>
        <View style={ styles.cellTitulo }>
          <Text>Insumos</Text>
        </View>
        <View style={ styles.cellTitulo }>
          <Text>Productos</Text>
        </View>
        <View style={ [ styles.cellTitulo, styles.cellTituloLast ] }>
          <Text>Usuarios</Text>
        </View>
      </View>


      { inputOutput.map( ( fila, idx ) => (
        <View style={ styles.rowContenido } key={ idx }>
          <View style={ styles.cellContenido }>
            <Text style={ styles.textoContenido }>{ fila.proveedor }</Text>
          </View>
          <View style={ styles.cellContenido }>
            <Text style={ styles.textoContenido }>{ fila.entrada }</Text>
          </View>
          <View style={ styles.cellContenido }>
            <Text style={ styles.textoContenido }>{ fila.salida }</Text>
          </View>
          <View style={ [ styles.cellContenido, styles.cellContenidoLast ] }>
            <Text style={ styles.textoContenido }>{ fila.cliente }</Text>
          </View>
        </View>
      ) ) }



    </View> );
};