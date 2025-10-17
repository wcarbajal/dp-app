// Función para convertir LaTeX básico a texto más legible
export const formatFormula = (latexFormula) => {
  if (!latexFormula) return '';
  
  return latexFormula
    // Reemplazar fracciones LaTeX
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
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

// Función para parsear fórmulas LaTeX y extraer partes
export const parseFormula = (latexFormula) => {
  if (!latexFormula) return [];

  const parts = [];
  let currentText = '';
  let i = 0;

  while (i < latexFormula.length) {
    if (latexFormula.substr(i, 5) === '\\frac') {
      if (currentText.trim()) {
        parts.push({ type: 'text', content: currentText.trim() });
        currentText = '';
      }

      let braceCount = 0;
      let start = i + 6;
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

      braceCount = 0;
      start = end + 2;
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
        numerador: formatFormula(numerador), 
        denominador: formatFormula(denominador) 
      });
      
      i = end + 1;
    } else {
      currentText += latexFormula[i];
      i++;
    }
  }

  if (currentText.trim()) {
    parts.push({ type: 'text', content: formatFormula(currentText) });
  }

  return parts;
};