import {z} from "zod";




export const MapaSchema = z.object({
  ruc: z.string().min(11, "El RUC debe tener exactamente 11 caracteres").max(11, "El RUC no puede exceder los 11 caracteres"),
  nombre: z.string().min(5, "El nombre debe tener al menos 5 caracteres").max(100, "El nombre no puede exceder los 100 caracteres"),
  descripcion: z.string().min(5, "La descripción debe tener al menos 5 caracteres").max(500, "La descripción no puede exceder los 500 caracteres").optional().or(z.literal("")),
  entrada: z.string("").min(5, "La entrada debe tener al menos 5 caracteres").max(500, "La entrada no puede exceder los 500 caracteres"),
  salida: z.string("").min(5, "La salida debe tener al menos 5 caracteres").max(500, "La salida no puede exceder los 500 caracteres"),

});
