
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create( {
  page: { padding: 30 },
  section: { margin: 10, padding: 10, border: '1pt solid #eee' },
} );

export const Pdfdocument = ( { nombre, datos } ) => {

  
  return (
    <Document>
      <Page size="A4" style={ styles.page }>
        <View style={ styles.section }>
          <Text>Hola, { nombre }!</Text>
          <Text>Datos:</Text>
          { datos.map( ( dato, idx ) => (
            <Text key={ idx }>• { dato }</Text>
          ) ) }
        </View>
      </Page>
    </Document>
  );
};