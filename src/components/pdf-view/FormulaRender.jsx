import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { parseFormula } from '@/utils/formula-utils';

const styles = StyleSheet.create({
  // Estilos para fracciones visuales
  fraccion: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  numerador: {
    fontSize: 10,
    textAlign: 'center',
    paddingBottom: 1,
  },
  lineaFraccion: {
    width: '100%',
    minWidth: 20,
    height: 1,
    backgroundColor: 'black',
    marginVertical: 1,
  },
  denominador: {
    fontSize: 10,
    textAlign: 'center',
    paddingTop: 1,
  },
  formulaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  textoFormula: {
    fontSize: 10,
    textAlign: 'center',
  }
});

// Componente para mostrar fracciones visuales en PDF
export const Fraccion = ({ numerador, denominador }) => (
  <View style={styles.fraccion}>
    <Text style={styles.numerador}>{numerador}</Text>
    <View style={styles.lineaFraccion} />
    <Text style={styles.denominador}>{denominador}</Text>
  </View>
);

// Componente para renderizar fórmulas complejas en PDF
export const FormulaRenderer = ({ formula }) => {
  const parts = parseFormula(formula);
  
  return (
    <View style={styles.formulaContainer}>
      {parts.map((part, index) => {
        if (part.type === 'fraccion') {
          return (
            <Fraccion
              key={index}
              numerador={part.numerador}
              denominador={part.denominador}
            />
          );
        } else {
          return (
            <Text key={index} style={styles.textoFormula}>
              {part.content}
            </Text>
          );
        }
      })}
    </View>
  );
};