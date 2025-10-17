
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { FormulaRenderer } from './FormulaRender.jsx';
import { Cabecera } from './partes/Cabecera';



const styles = StyleSheet.create( {
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  tabla: {
    display: 'flex',
    flexDirection: 'column',
  },
  rowTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    color: 'black',
    border: '1px',
    borderColor: '000',
    backgroundColor: "#f0f0f0",
  },
  rowDetalle: {
    display: 'flex',
    flexDirection: 'row',

  },
  colSubtitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '30%',
    backgroundColor: "#f0f0f0",
    borderLeft: '1px',
    borderBottom: '1px',
    padding: 5,
  },
  colContenido2: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '25%',
    backgroundColor: "#f0f0f0",    
    
  },
  colContenido: {
    fontSize: 12,
    width: '70%',
    borderRight: '1px',
    borderBottom: '1px',
    borderLeft: '1px',
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
  },
  colContenidoX: {
    fontSize: 12,
    width: '70%',
    borderRight: '1px',
    borderBottom: '1px',
    borderLeft: '1px',
    display: 'flex',
    flexDirection: 'row',    
  },
   colContenido3: {
    fontSize: 12,        
    padding: 5,
  },
  
  col1Col3: {
    width: '50%',

  },
  col2Col3: {
    width: '25%',
    backgroundColor: "#f0f0f0",
    borderLeft: '1px',
    margin: 0,
    padding: 5,
  },
  col3Col3: {
    borderLeft: '1px',
    padding: 5,
  },
  content: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
  },
  fieldLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 5,
    color: '#1f2937',
  }
} );


export const IndicadorPdf = ( { proceso, indicador } ) => {
  return (
    <Document>
      <Page size="A4" style={ styles.page }>
        <Cabecera imagen="/img/MINEDU.png" />

        <View style={ styles.tabla }>

          <View style={ styles.rowTitulo }>
            <Text style={ styles.fieldLabel }>Ficha de indicador de proceso</Text>
          </View>

          <View style={ styles.rowDetalle }>
            <Text style={ styles.colSubtitulo }>Proceso:</Text>
            <Text style={ styles.colContenido }>{ proceso?.codigo } { proceso?.nombre }</Text>
          </View>

          <View style={ styles.rowDetalle }>
            <Text style={ styles.colSubtitulo }>Producto:</Text>
            <Text style={ styles.colContenido }>Sin producto</Text>
          </View>

          <View style={ styles.rowDetalle }>
            <Text style={ styles.colSubtitulo }>Nombre de indicador:</Text>

            <View style={ styles.colContenidoX }>
              <View style={ styles.col1Col3 }>
                <Text style={ styles.colContenido3 }>{ indicador?.nombre || 'No asignado' }</Text>

              </View>
              <View style={ styles.col2Col3 }>
                <Text style={ styles.colSubtitulo2 }>Tipo</Text>

              </View>
              <View style={ styles.col3Col3 }>
                <Text style={ styles.colContenido2 }>{ indicador?.tipoIndicador || 'No asignado' }</Text>

              </View>

            </View>
          </View>

          <View style={ styles.rowDetalle }>
            <Text style={ styles.colSubtitulo }>Justificación:</Text>
            <Text style={ styles.colContenido }>{ indicador?.justificacion || 'No asignado' }</Text>
          </View>

          <View style={ styles.rowDetalle }>
            <Text style={ styles.colSubtitulo }>Responsable:</Text>
            <Text style={ styles.colContenido }>{ indicador?.responsable || 'No asignado' }</Text>
          </View>

          <View style={ styles.rowDetalle }>
            <Text style={ styles.colSubtitulo }>Metodo de cálculo:</Text>
            <View style={ styles.colContenido }>
              { indicador?.formula ? (
                <FormulaRenderer formula={ indicador.formula } />
              ) : (
                <Text>No definida</Text>
              ) }
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}

