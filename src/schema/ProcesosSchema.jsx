import { z } from "zod";

export const nuevoProcesoSchema = z.object( {

  codigo: z.string().min( 2, "El código es obligatorio" ),
  nombre: z.string().min( 5, "El nombre es obligatorio" ),
  descripcion: z.string().min( 5, "La descripción es obligatoria" ),
  nivel: z.enum( [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ], {
    errorMap: () => ( { message: "Nivel no válido" } ),
  } ),
  tipo: z.enum( [ "Misional", "Soporte", "Estratégico" ], {
    errorMap: () => ( { message: "Tipo de proceso no válido" } ),
  } ),
  idMapa: z.string().regex( /^\d+$/, "El ID del mapa debe ser un número entero positivo"),
  parentId: z.string()
    .regex( /^\d+$/, "El ID del padre debe ser un número entero positivo" )
    .optional()
    .or( z.literal( "" ) ),

} );

export const actualizarProcesoSchema  = z.object( {
  codigo: z.string().min( 2, "El código es obligatorio" ).optional(),//ok
  nombre: z.string().min( 5, "El nombre es obligatorio" ).optional(),// ok
  descripcion: z.string().min( 5, "La descripción es obligatoria" ).optional(),//ok
  nivel: z.enum( [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ], {
    errorMap: () => ( { message: "Nivel no válido" } ),
  } ).optional(),//
  tipo: z.enum( [ "Estratégico", "Misional", "Soporte" ], {
    errorMap: () => ( { message: "Tipo de proceso no válido" } ),
  } ).optional(),//ok
  objetivo: z.string().min( 5, "El objetivo es obligatorio" ).optional(),
  alcance: z.string().min( 5, "El alcance es obligatorio" ).optional(),
  estrategico: z.string().min( 5, "Los objetivos estratégicos son obligatorios" ).optional(),
  owners: z.array( z.string() ).optional(),
} );



export const procedimientoSchema = z.object( {
  id: z.number().optional(), // Solo si lo usas en edición
  //idproceso: z.number().min( 1, "El ID del detalle de proceso es obligatorio" ).optional(),
  //idprocedimiento: z.number().min( 1, "El ID del procedimiento es obligatorio" ).optional(),
  actividades: z.array(
    z.object( {
      id: z.number().optional(),
      nombre: z.string().min( 3, "El nombre de la actividad es obligatorio" ),
      descripcion: z.string().min( 5, "La descripción es obligatoria" ).optional(),
      unidadOperativa: z.string().min( 3, "La unidad operativa es obligatoria" ).optional(),
      responsable: z.string().min( 3, "El responsable es obligatorio" ).optional()
    } )
  ).optional()
 
} );

