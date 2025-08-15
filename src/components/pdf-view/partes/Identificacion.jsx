import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create( {
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginVertical: 10,
    fontSize: 10,
  },
  row: {
    flexDirection: "row",
  },
  cellConcept: {
    width: 110,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  cellDetail: {
    width: 500,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },
  rowMain: {
    display: "flex",
    flexDirection: "row",
    
    
  },
  cellRowMain1: {
    width: 114,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold", 
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  }
  ,
  cellRowMain2: {
    width: 300,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  }
  ,
  cellRowMain3: {
    width: 50,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  }
  ,
  cellRowMain4: {
    width: 80,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },
  cellRowMain5: {
    width: 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  }


} );

export const Identificacion = ( {
  codigo = "E4",
  nombre = "Mejora de procesos",
  objetivo = "Mejorar la gestión de procesos",
  objetivoE = "Optimizar recursos y tiempos",
  dueno = "Juan Pérez"
} ) => (
  <View style={ styles.table }>
    <View style={ styles.row }>
      <View style={ styles.rowMain }>
        <Text style={ styles.cellRowMain1 }>Código y nombre</Text>
        <Text style={ styles.cellRowMain2 }>{ codigo } - { nombre}</Text>
        <Text style={ styles.cellRowMain3 }>Tipo</Text>
        <Text style={ styles.cellRowMain4 }>Estratégico</Text>
        <Text style={ styles.cellRowMain3 }>Versión</Text>
        <Text style={ styles.cellRowMain5  }>1</Text>
      </View>
    </View>
    <View style={ styles.row }>
      <Text style={ styles.cellConcept }>Objetivo</Text>
      <Text style={ styles.cellDetail }>{ objetivo }</Text>
    </View>
    <View style={ styles.row }>
      <Text style={ styles.cellConcept }>ObjetivoE</Text>
      <Text style={ styles.cellDetail }>{ objetivoE }</Text>
    </View>
    <View style={ styles.row }>
      <Text style={ styles.cellConcept }>Dueño</Text>
      <Text style={ styles.cellDetail }>{ dueno }</Text>
    </View>
  </View>
);