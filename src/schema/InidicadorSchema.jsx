import z from 'zod';


export const nuevoIndicadorSchema = z.object( {
  codigo: z.string().min( 2, "Debe tener al menos 2 caracteres" ).max( 20, "Debe tener como máximo 20 caracteres" ),
  nombre: z.string().min( 2, "Campo requerido" ).max( 100, "Debe tener como máximo 100 caracteres" ),
  tipoNivel: z.enum( [ "OEI", "AEI", "IO" ], "Selecciona una opción" ),
  parentId: z.string().optional().nullable(),
  mapaId: z.number().optional().nullable(),
} );


// Zod schema para validación de Indicador
export const modificarIndicadorSchema = z.object( {
  codigo: z.string().min( 1, "El código es obligatorio" ),
  nombre: z.string().min( 1, "El nombre es obligatorio" ),
  tipoNivel: z.enum( [ "OEI", "AEI", "IO" ] ),
  estado: z.boolean(),
  justificacion: z.string().optional(),
  formula: z.string().optional(),
  sentidoEsperado: z.string().optional(),
  unidadMedida: z.string().optional(),
  frecuencia: z.string().optional(),
  fuenteDatos: z.string().optional(),
  logrosEsperados: z.string().optional(),
  lineaBase: z.string().optional(),
} );


// Zod schema para validación de Resultado
export const resultadoIndicadorSchema = z.object( {
  denominacion: z.string().optional(),
  descripcion: z.string().optional(),
  valor: z.coerce.number().min( 0, "Debe ser un número positivo" ),
  fechaRegistro: z.string().min( 1, "La fecha es obligatoria" ),
} );