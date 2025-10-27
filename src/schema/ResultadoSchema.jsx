
import { z } from "zod";

// Schema de validación con Zod
export const resultadoSchema = z.object( {
  denominacion: z.string().optional(),
  descripcion: z.string().optional(),
  valor: z
    .string()
    .min( 1, "El valor es requerido" )
    .transform( ( val ) => parseFloat( val ) )
    .refine( ( val ) => !isNaN( val ), "Debe ser un número válido" ),
  fechaRegistro: z
    .string()
    .min( 1, "La fecha de registro es requerida" )
    .refine( ( date ) => {
      const parsedDate = new Date( date );
      return !isNaN( parsedDate.getTime() );
    }, "Debe ser una fecha válida" )
    .transform( ( date ) => {
      // Convertir a formato ISO completo para enviar al backend
      const parsedDate = new Date( date + 'T00:00:00.000Z' );
      return parsedDate.toISOString();
    } ),
} );
