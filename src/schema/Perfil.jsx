import { z } from "zod";

export const perfilSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  apellidoPaterno: z.string().min(2, "El apellido paterno es obligatorio").max(100, "El apellido paterno no puede exceder los 100 caracteres").optional(),
  apellidoMaterno: z.string().min(2, "El apellido materno es obligatorio").max(100, "El apellido materno no puede exceder los 100 caracteres").optional(),
  correo: z.string().email("Correo inválido"),
});