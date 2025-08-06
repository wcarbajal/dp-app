

import z from 'zod';

export const OwnerSchema = z.object({
  
  oficina: z.string().min(2, "La oficina es obligatoria").max(50, "La oficina no puede exceder los 50 caracteres"),
  siglas: z.string().min(2, "Las siglas son obligatorias").max(10, "Las siglas no pueden exceder los 10 caracteres"),
  director: z.string().min(2, "El director es obligatorio").max(100, "El director no puede exceder los 100 caracteres"),
  correo: z.string().email("Correo inválido").optional(),
});
