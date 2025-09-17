import z from 'zod';


export const nuevoIndicadorSchema = z.object( {
  codigo: z.string().min( 2, "Debe tener al menos 2 caracteres" ).max( 20, "Debe tener como máximo 20 caracteres" ),
  nombre: z.string().min( 2, "Campo requerido" ).max( 100, "Debe tener como máximo 100 caracteres" ),
  tipoNivel: z.enum( [ "OEI", "AEI", "IO" ], "Selecciona una opción" ),
  parentId: z.string().optional().nullable(),
  mapaId: z.number().optional().nullable(),
} );
