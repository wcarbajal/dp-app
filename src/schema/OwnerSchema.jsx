

import z from 'zod';

export const OwnerSchema = z.object({
  mapaId: z.number().min(1, "El mapa es obligatorio"),
  oficina: z.string().min(1, "Debe seleccionar una oficina o dirección válida").max(70, "La oficina no puede exceder los 70 caracteres"),
  siglas: z.string().min(2, "Debe seleccionar una oficina o dirección válida").max(20, "Las siglas no pueden exceder los 20 caracteres"),
  director: z.string().min(2, "El director es obligatorio").max(100, "El director no puede exceder los 100 caracteres"),
  correo: z.string().email("Correo inválido").optional(),
});
