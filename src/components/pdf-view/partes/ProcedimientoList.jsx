import { View, Text, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create( {
  tabla: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: '1pt',
    borderLeft: '1pt',
    borderRight: '1pt',
  },
  cabeceraIzquierda: {
    backgroundColor: '#f0f0f0',
    width: '70%',
    fontWeight: 'bold',
    padding: 3,

  },
  cabeceraDerecha: {
    backgroundColor: '#f0f0f0',
    width: '30%',
    fontWeight: 'bold',
    borderLeft: '1pt',

    padding: 3,

  },
  tituloActividad: {
    borderTop: '1pt',
    borderBottom: '1pt',
  },
  textoContenido: {
    fontSize: 10
  },
  actividades: {
    display: 'flex',
    flexDirection: 'row',
  }
} );


export const ProcedimientoList = ( { listaActividades = [], codigo = "sin codigo", nombre = "sin nombre", version = "sin version" } ) => {
  return (
    <View style={ styles.tabla }>
      <View>
        <View style={ styles.cabeceraIzquierda }>
          <Text style={ styles.textoContenido }>Derecha</Text>
        </View>
        <View style={ styles.cabeceraDerecha }>
          <Text style={ styles.textoContenido }>Izquierda</Text>
        </View>
        <View style={ styles.tituloActividad }>
        </View>
      </View>
      <View style={ styles.actividades }>

      </View>
      <View style={ styles.actividades }>

      </View>
    </View>
  );
};