import z from 'zod';


export const usuarioSchema = z.object( {
  mapaId: z.number().min( 1, "El mapa es obligatorio" ),
  nombre: z.string().min( 2, "El nombre es obligatorio" ).max( 100, "El nombre no puede exceder los 100 caracteres" ),
  apellidoPaterno: z.string().min( 2, "El apellido paterno es obligatorio" ).max( 70, "El apellido paterno no puede exceder los 70 caracteres" ),
  apellidoMaterno: z.string().min( 2, "El apellido materno es obligatorio" ).max( 70, "El apellido materno no puede exceder los 70 caracteres" ),
  correo: z.string().email( "El correo debe ser válido" ),
  rol: z.int().min( 1, "El rol es obligatorio" ),
  password: z.string().min( 6, "La contraseña debe tener al menos 6 caracteres" ).max( 100, "La contraseña no puede exceder los 100 caracteres" ),
  img: z.string().optional(),

} );

