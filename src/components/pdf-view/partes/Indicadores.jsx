import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    borderRightWidth: 0,
    borderBottomWidth: 0, 
    marginVertical: 10,
    fontSize: 10,
    flexDirection: "column",
  },
  cellCabecera: {
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "black",
    backgroundColor: "#f0f0f0",
  },
  rowTitulo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cellTitulo: {
    width: "50%",
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: "#f0f0f0",
  },
  cellTituloLast: {
    borderRightWidth: 1,
  },
  rowContenido: {
    flexDirection: "row",
    alignItems: "stretch", // Cambiado para que las celdas tengan la misma altura
    minHeight: 40, // Altura mínima para las filas
  },
  cellContenido: {
    width: "50%",
    padding: 5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: "#fff",
    flexGrow: 1, // Permite que la celda crezca según el contenido
  },
  cellContenidoLast: {
    borderRightWidth: 0,
  },
  textoTitulo: {
    fontWeight: "bold",
    fontSize: 12,
  },
  textoContenido: {
    fontSize: 10,
  },
  fraccion: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2, // Pequeño margen horizontal
  },
  numerador: {
    fontSize: 9,
    textAlign: 'center',
    paddingBottom: 1,
    minHeight: 12, // Altura mínima para consistencia
  },
  lineaFraccion: {
    width: '100%',
    minWidth: 20, // Ancho mínimo para la línea
    height: 1,
    backgroundColor: 'black',
    marginVertical: 1,
  },
  denominador: {
    fontSize: 9,
    textAlign: 'center',
    paddingTop: 1,
    minHeight: 12, // Altura mínima para consistencia
  },
  formulaContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Alinea todos los elementos al centro verticalmente
    justifyContent: 'center',
    flexWrap: 'wrap',
    minHeight: 30, // Altura mínima para la fórmula completa
  },
  textoFormula: {
    fontSize: 10,
    lineHeight: 1, // Altura de línea ajustada
    textAlign: 'center',
    alignSelf: 'center', // Se alinea al centro del contenedor
  }
});

// Componente para mostrar fracciones
const Fraccion = ({ numerador, denominador }) => (
  <View style={styles.fraccion}>
    <Text style={styles.numerador}>{numerador}</Text>
    <View style={styles.lineaFraccion} />
    <Text style={styles.denominador}>{denominador}</Text>
  </View>
);

// Función para parsear y renderizar fórmulas con fracciones visuales
const parseFormula = (latexFormula) => {
  if (!latexFormula) return [];

  const parts = [];
  let currentText = '';
  let i = 0;

  while (i < latexFormula.length) {
    // Buscar fracciones \frac{numerador}{denominador}
    if (latexFormula.substr(i, 5) === '\\frac') {
      // Agregar texto acumulado antes de la fracción
      if (currentText.trim()) {
        parts.push({ type: 'text', content: currentText.trim() });
        currentText = '';
      }

      // Buscar el numerador
      let braceCount = 0;
      let start = i + 6; // después de '\frac{'
      let end = start;
      
      for (let j = start; j < latexFormula.length; j++) {
        if (latexFormula[j] === '{') braceCount++;
        if (latexFormula[j] === '}') {
          if (braceCount === 0) {
            end = j;
            break;
          }
          braceCount--;
        }
      }
      
      const numerador = latexFormula.substring(start, end);

      // Buscar el denominador
      braceCount = 0;
      start = end + 2; // después de '}{'
      end = start;
      
      for (let j = start; j < latexFormula.length; j++) {
        if (latexFormula[j] === '{') braceCount++;
        if (latexFormula[j] === '}') {
          if (braceCount === 0) {
            end = j;
            break;
          }
          braceCount--;
        }
      }
      
      const denominador = latexFormula.substring(start, end);
      
      parts.push({ 
        type: 'fraccion', 
        numerador: cleanLatex(numerador), 
        denominador: cleanLatex(denominador) 
      });
      
      i = end + 1;
      
      // Saltar espacios inmediatamente después de la fracción
      while (i < latexFormula.length && latexFormula[i] === ' ') {
        i++;
      }
    } else {
      currentText += latexFormula[i];
      i++;
    }
  }

  // Agregar texto restante
  if (currentText.trim()) {
    parts.push({ type: 'text', content: cleanLatex(currentText) });
  }

  return parts;
};

// Función para limpiar LaTeX básico
const cleanLatex = (text) => {
  return text
    // Reemplazar superíndices
    .replace(/\^{?([^}\\s]+)}?/g, '^$1')
    // Reemplazar subíndices
    .replace(/_{?([^}\\s]+)}?/g, '_$1')
    // Reemplazar símbolos matemáticos comunes
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\prod/g, 'Π')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    // Limpiar comandos LaTeX restantes
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}]/g, '')
    .trim();
};

// Componente para renderizar fórmulas
const FormulaRenderer = ({ formula }) => {
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

export const Indicadores = ({ indicadores }) => {
  

  return (
    <View style={ styles.table }>
      <View style={ styles.cellCabecera }>
        <Text style={ styles.textoTitulo }>Indicadores del proceso</Text>
      </View>

      <View style={ styles.rowTitulo }>
        <View style={ styles.cellTitulo }>
          <Text>Nombre</Text>
        </View>      
        <View style={ [ styles.cellTitulo, styles.cellTituloLast ] }>
          <Text>Fórmula</Text>
        </View>
      </View>

      { indicadores.map( ( fila, idx ) => (
        <View style={ styles.rowContenido } key={ idx }>
          <View style={ styles.cellContenido }>
            <Text style={ styles.textoContenido }>{ fila.nombre }</Text>
          </View>
          <View style={ styles.cellContenido }>
            <FormulaRenderer formula={fila.formula} />
          </View>
        </View>
      ) ) }
    </View>
  );
};