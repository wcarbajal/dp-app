import z from 'zod';


export const entradaSalidaSchema = z.object( {
  inputOutput: z.array(
    z.object( {
      id: z.int().optional(),
      entrada: z.string().min( 3, "Campo requerido" ),
      salida: z.string().min( 3, "Campo requerido" ),
      proveedor: z.string().min( 3, "Campo requerido" ),
      cliente: z.string().min( 3, "Campo requerido" ),
    } )
  ),


} );


export const riesgosSchema = z.object( {
  riesgos: z.array(
    z.object( {
      denominacion: z.string().min( 1, "Campo requerido" ),
    } )
  ),

} );


export const registrosSchema = z.object( {
  registros: z.array(
    z.object( {
      denominacion: z.string().min( 1, "Campo requerido" ),
      tipo: z.enum( ["físico", "digital"], { required_error: "Campo requerido" } ).optional()
    } )
  ),

} );

