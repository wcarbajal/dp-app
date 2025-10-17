
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1f2937',
    borderBottom: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 10,
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
  },
  fieldValue: {
    marginBottom: 15,
    paddingLeft: 10,
    color: '#4b5563',
  }
});



export const IndicadorPdf = ({ indicador }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>INDICADOR: {indicador?.nombre || 'Sin nombre'}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.fieldLabel}>Descripción:</Text>
          <Text style={styles.fieldValue}>{indicador?.descripcion || 'No disponible'}</Text>
          
          <Text style={styles.fieldLabel}>Tipo:</Text>
          <Text style={styles.fieldValue}>{indicador?.tipo || 'No especificado'}</Text>
          
          <Text style={styles.fieldLabel}>Frecuencia:</Text>
          <Text style={styles.fieldValue}>{indicador?.frecuencia || 'No especificada'}</Text>
          
          <Text style={styles.fieldLabel}>Meta:</Text>
          <Text style={styles.fieldValue}>{indicador?.meta || 'No definida'}</Text>
          
          <Text style={styles.fieldLabel}>Responsable:</Text>
          <Text style={styles.fieldValue}>{indicador?.responsable || 'No asignado'}</Text>
          
          {indicador?.observaciones && (
            <>
              <Text style={styles.fieldLabel}>Observaciones:</Text>
              <Text style={styles.fieldValue}>{indicador.observaciones}</Text>
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}

