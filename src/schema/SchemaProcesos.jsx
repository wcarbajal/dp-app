import { z } from "zod"
 
export const nuevoProcesoSchema = z.object({
  
  codigo: z.string().min(2, "El código es obligatorio"),
  nombre: z.string().min(5, "El nombre es obligatorio"),
  descripcion: z.string().min(5, "La descripción es obligatoria"),
  nivel: z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], {
    errorMap: () => ({ message: "Nivel no válido" }),
  }),
  tipo: z.enum(["Misional", "Soporte", "Estratégico"], {
    errorMap: () => ({ message: "Tipo de proceso no válido" }),
  }),
  parentId: z.string()
  .regex(/^\d+$/, "El ID del padre debe ser un número entero positivo")
  .optional()
  .or(z.literal("")),

});

export const actualizarProcesoSchema = z.object({
  codigo: z.string().min(2, "El código es obligatorio").optional(),
  nombre: z.string().min(5, "El nombre es obligatorio").optional(),
  descripcion: z.string().min(5, "La descripción es obligatoria").optional(),
  nivel: z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], {
    errorMap: () => ({ message: "Nivel no válido" }),
  }).optional(),
  tipo: z.enum(["Misional", "Soporte", "Estratégico"], {
    errorMap: () => ({ message: "Tipo de proceso no válido" }),
  }).optional(),
  parentId: z.string()
    .regex(/^\d+$/, "El ID del padre debe ser un número entero positivo")
    .optional()
    .or(z.literal("")).optional(),
});