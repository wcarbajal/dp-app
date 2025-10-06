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

export const Identificacion = ( { proceso } ) => {

  const { codigo, nombre, objetivo, estrategico, owners, tipo, version } = proceso || {};
  
  // Extraer las unidades operativas de los owners
  const obtenerUnidadesOperativas = () => {
    if (!owners || !Array.isArray(owners) || owners.length === 0) {
      return 'No asignado';
    }
    
    // Mapear los owners para obtener sus unidades operativas
    const unidadesOperativas = owners
      .map(owner => owner?.unidadOperativa?.nombre)
      .filter(nombre => nombre) // Filtrar valores nulos o undefined
      .join(', '); // Unir con comas
    
    return unidadesOperativas || 'No asignado';
  };

  const duenios = obtenerUnidadesOperativas();

 
  
 return (<View style={ styles.table }>
    <View style={ styles.row }>
      <View style={ styles.rowMain }>
        <Text style={ styles.cellRowMain1 }>Código y nombre</Text>
        <Text style={ styles.cellRowMain2 }>{ codigo } - { nombre}</Text>
        <Text style={ styles.cellRowMain3 }>Tipo</Text>
        <Text style={ styles.cellRowMain4 }>{ tipo }</Text>
        <Text style={ styles.cellRowMain3 }>Versión</Text>
        <Text style={ styles.cellRowMain5  }>{ version }</Text>
      </View>
    </View>
    <View style={ styles.row }>
      <Text style={ styles.cellConcept }>Objetivo</Text>
      <Text style={ styles.cellDetail }>{ objetivo }</Text>
    </View>
    <View style={ styles.row }>
      <Text style={ styles.cellConcept }>ObjetivoE</Text>
      <Text style={ styles.cellDetail }>{ estrategico?.nombre || 'No asignado' }</Text>
    </View>
    <View style={ styles.row }>
      <Text style={ styles.cellConcept }>Dueño</Text>
      <Text style={ styles.cellDetail }>{ duenios }</Text>
    </View>
  </View>
 )
};