import { z } from "zod"
 
export const nuevoProcesoSchema = z.object({
  
  codigo: z.string().min(2, "El código es obligatorio"),
  nombre: z.string().min(5, "El nombre es obligatorio"),
  descripcion: z.string().min(5, "La descripción es obligatoria"),
  parentId: z.string()
  .regex(/^\d+$/, "El ID del padre debe ser un número entero positivo")
  .optional()
  .or(z.literal("")),

});
