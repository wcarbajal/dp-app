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
    width: '60%',
    fontWeight: 'bold',
  },
  cabeceraDerecha: {
    backgroundColor: '#f0f0f0',
    width: '20%',
    fontWeight: 'bold',
    borderLeft: '1pt',
    padding: 3,
  },
  rowTareaTitulo: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: '1pt',
     backgroundColor: '#f0f0f0',
     justifyContent: 'center',
  },
  rowTareaEncabezado: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: '1pt',
  },
  rowTareaContenido: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: '1pt',
  },
  colNumero: {
    width: '5%',
    backgroundColor: '#f0f0f0',
  },
  colNumeros: {
    width: '5%',
  },
  colDescripcion: {
    width: '55%',
    backgroundColor: '#f0f0f0',
    borderLeftWidth: '1pt',

  },
  colDescripciones: {
    width: '55%',
    borderLeftWidth: '1pt',

  },
  colResponsable: {
    width: '40%',
    backgroundColor: '#f0f0f0',
    borderLeftWidth: '1pt',
  },
  colResponsables: {
    width: '40%',
    borderLeftWidth: '1pt',
  },
  textoTitulo:{
    fontSize: 12,
    padding: 3,
    fontWeight: 'bold',
  },
  textoContenido: {
    fontSize: 10,
    padding: 3,
  }
} );


export const ProcedimientoList = ( {
  listaActividades = [
    {
      id: 1,
      descripcion: "Actividad 1",
      responsable: "Juan Perez"
    },
    {
      id: 2,
      descripcion: "Actividad 2",
      responsable: "Maria Gomez"
    }
  ],
  codigo = "sin codigo",
  nombre = "sin nombre",
  version = "sin version"
} ) => {
  return (
    <View style={ styles.tabla }>

      <View style={ styles.rowTareaTitulo }>
        <View style={ styles.cabeceraIzquierda }>
          <Text style={ styles.textoContenido }>Nombre: { nombre }</Text>
        </View>
        <View style={ styles.cabeceraDerecha }>
          <Text style={ styles.textoContenido }>Codigo: { codigo }</Text>          
        </View>
         <View style={ styles.cabeceraDerecha }>
          <Text style={ styles.textoContenido }>Versión: { version }</Text>          
        </View>
      </View>

      <View style={ styles.rowTareaTitulo }>
        <Text style={ styles.textoContenido }>Actividades</Text>
      </View>

      <View style={ styles.rowTareaEncabezado }>
        <View style={ styles.colNumero }>
          <Text style={ styles.textoContenido }>Nº</Text>
        </View>
        <View style={ styles.colDescripcion }>
          <Text style={ styles.textoContenido }>Descripcion de tarea</Text>
        </View>
        <View style={ styles.colResponsable }>
          <Text style={ styles.textoContenido }>Responsable</Text>
        </View>
      </View>
      {
        listaActividades.map( ( actividad, index ) => (
          <View style={ styles.rowTareaContenido } key={ actividad.id }>
            <View style={ styles.colNumeros }>
              <Text style={ styles.textoContenido }>{ index + 1 }</Text>
            </View>
            <View style={ styles.colDescripciones }>
              <Text style={ styles.textoTitulo }>{ actividad.nombre }</Text>
              <Text style={ styles.textoContenido }>{ actividad.descripcion }</Text>
            </View>
            <View style={ styles.colResponsables }>
              <Text style={ styles.textoContenido }>{ actividad.responsable }</Text>
            </View>
          </View>
        ) )
      }



      <View >
        <Text style={ styles.textoContenido }>Fin de procedimiento</Text>
      </View>

    </View>
  );
};