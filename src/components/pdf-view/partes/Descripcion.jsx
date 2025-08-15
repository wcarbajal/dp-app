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
});

const datos = [
  [ "Proveedor 1", "Insumo 1", "Producto 1", "Usuario 1" ],
  [ "Proveedor 2", "Insumo 2", "Producto 2", "Usuario 2" ],
  [ "Proveedor 3", "Insumo 3", "Producto 3", "Usuario 3" ],
];

export const Descripcion = () => (

  <View style={ styles.table }>

    <View style={ styles.cellCabecera }>
      <Text style={ styles.textoTitulo }>Descripción del proceso</Text>
    </View>

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


    { datos.map( ( fila, idx ) => (
      <View style={ styles.rowContenido } key={ idx }>
        <View style={ styles.cellContenido }>
          <Text style={ styles.textoContenido }>{ fila[ 0 ] }</Text>
        </View>
        <View style={ styles.cellContenido }>
          <Text style={ styles.textoContenido }>{ fila[ 1 ] }</Text>
        </View>
        <View style={ styles.cellContenido }>
          <Text style={ styles.textoContenido }>{ fila[ 2 ] }</Text>
        </View>
        <View style={ [ styles.cellContenido, styles.cellContenidoLast ] }>
          <Text style={ styles.textoContenido }>{ fila[ 3 ] }</Text>
        </View>
      </View>
    ) ) }



  </View>
);