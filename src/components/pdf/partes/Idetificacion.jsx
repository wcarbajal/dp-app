import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
   cellConceptOne: {
    width: '20%',
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  cellConcept: {
    width: 100,
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
  
});

export const Idetificacion = ({
  codigo = "E4",
  objetivo = "Mejorar la gestión de procesos",
  objetivoE = "Optimizar recursos y tiempos",
  dueno = "Juan Pérez"
}) => (
  <View style={styles.table}>
    <View style={styles.row}>
      <Text style={styles.cellConcept}>Código</Text>
      <Text style={styles.cellDetail}>{codigo}</Text>      
      <Text style={styles.cellConcept}>Código</Text>
      <Text style={styles.cellDetail}>{codigo}</Text>   
       <Text style={styles.cellConcept}>Código</Text>
      <Text style={styles.cellDetail}>{codigo}</Text>   
    </View>
    <View style={styles.row}>
      <Text style={styles.cellConcept}>Objetivo</Text>
      <Text style={styles.cellDetail}>{objetivo}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.cellConcept}>ObjetivoE</Text>
      <Text style={styles.cellDetail}>{objetivoE}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.cellConcept}>Dueño</Text>
      <Text style={styles.cellDetail}>{dueno}</Text>
    </View>
  </View>
);