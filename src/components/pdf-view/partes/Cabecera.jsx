import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';


const styles = StyleSheet.create( {
  page: { padding: 30 },
  contenedorTitulo: { display: 'flex', flexDirection: 'row', alignItems: 'center', border: '1pt solid #eee' },
  seccionTituloIz: { borderRight: '1pt solid #eee', width: '25%', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  seccionTituloCentro: { width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  seccionTituloDer: { border: '1pt solid #eee', width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 9, },
  cabeceraDerecha: { backgroundColor: '#D9D9D9', width: '100%', height: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', width: '100%' }
} );


export const Cabecera = ({imagen, titulo, codigoFormato, version}) => {
  
  // Validar si la imagen es válida
  const isValidImage = imagen && 
    (imagen.startsWith('data:image/') || 
     imagen.startsWith('http') || 
     imagen.startsWith('/'));

  return (
    <View style={ styles.contenedorTitulo }>
      <View style={ styles.seccionTituloIz }>
        {isValidImage ? (
          <Image src={imagen} style={ { width: '100%', height: 'auto' } } />
        ) : (
          <View style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#f0f0f0'
          }}>
            <Text style={{ fontSize: 8, color: '#666' }}>Logo</Text>
          </View>
        )}
      </View>
      <View style={ styles.seccionTituloCentro }>
        <Text style={ styles.titulo }>{titulo} </Text>
      </View>
      <View style={ styles.seccionTituloDer }>
        <View style={ styles.cabeceraDerecha }>
          <Text >Código del formato </Text>
        </View>
        <Text>{codigoFormato}</Text>
        <View style={ styles.cabeceraDerecha }>
          <Text >Versión del formato </Text>
        </View>
        <Text>{version}</Text>
      </View>
    </View>
  );
};