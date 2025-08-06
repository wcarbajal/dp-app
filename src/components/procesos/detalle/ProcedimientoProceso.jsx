import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { procedimientoSchema } from '@/schema/ProcesosSchema';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineDeleteOutline } from 'react-icons/md';
import { IoAddOutline } from "react-icons/io5";
import { fetchConToken } from '@/helpers/fetch';

export const ProcedimientoProceso = ( { procedimiento, idProceso, idDetalleProcesos } ) => {


  const form = useForm( {
    resolver: zodResolver( procedimientoSchema ),
    defaultValues: {
      id: idProceso || undefined,
      iddetalleproceso: idDetalleProcesos || undefined,
      idprocedimiento: procedimiento.id || undefined,
      actividades: procedimiento.actividades || [],
    },
    mode: "onChange",
  } );


  const { fields, append, remove, update } = useFieldArray( {
    control: form.control,
    name: "actividades",
  } );
  const moveUp = ( idx ) => {
    if ( idx === 0 ) return; // Ya está arriba
    // Intercambia el actual con el anterior usando update
    update( idx, fields[ idx - 1 ] );
    update( idx - 1, fields[ idx ] );
  };

  const moveDown = ( idx ) => {
    if ( idx === fields.length - 1 ) return; // Ya está abajo
    // Intercambia el actual con el siguiente usando update
    update( idx, fields[ idx + 1 ] );
    update( idx + 1, fields[ idx ] );
  };
  const onSubmit = async ( formulario ) => {


    // Aquí puedes manejar el envío del formulario a fetchConToken
    const result = await fetchConToken( `procesos/registrar-procedimiento/${ formulario.id }`, {
      iddetalleproceso: formulario.iddetalleproceso,
      idprocedimiento: formulario.idprocedimiento,
      actividades: formulario.actividades,
    }, "POST" );
    console.log( { result } );
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit( onSubmit ) } className="flex flex-col gap-5">
        <h3 className="text-lg font-bold">Actividades</h3>

        <table className="min-w-full border rounded-md">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Nombre de actividad</th>
              <th className="p-2 border">Descripción de la actividad</th>
              <th className="p-2 border">Unidad Operativa</th>
              <th className="p-2 border">Responsable de la actividad</th>
              <th className="p-2 border w-[60px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            { fields.length === 0 ? (
              <tr>
                <td colSpan={ 6 } className="p-2 border text-center">
                  <span>sin actividades</span>
                </td>
              </tr>
            ) : (
              fields.map( ( field, idx ) => (
                <tr key={ field.id }>
                  <td className="p-2 border text-center">{ idx + 1 }</td>
                  <td className="p-2 border">
                    <FormField
                      control={ form.control }
                      name={ `actividades.${ idx }.nombre` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Input { ...field } placeholder="Nombre de la actividad" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border">
                    <FormField
                      control={ form.control }
                      name={ `actividades.${ idx }.descripcion` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Textarea { ...field } placeholder="Descripción" rows={ 3 } />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border">
                    <FormField
                      control={ form.control }
                      name={ `actividades.${ idx }.unidadOperativa` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Input { ...field } placeholder="Unidad Operativa" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border">
                    <FormField
                      control={ form.control }
                      name={ `actividades.${ idx }.responsable` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Input { ...field } placeholder="Responsable" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className=" border w-[60px]">
                    <div className="flex gap-2 justify-center ">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-6 w-6 p-1"
                        onClick={ () => moveUp( idx ) }>
                        <MdKeyboardArrowUp size={ 10 } />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="h-6 w-6 p-1"
                        onClick={ () => remove( idx ) }>
                        <MdOutlineDeleteOutline size={ 10 } />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-6 w-6 p-1"
                        onClick={ () => moveDown( idx ) }>
                        <MdKeyboardArrowDown size={ 10 } />
                      </Button>
                    </div>
                  </td>
                </tr>
              ) )
            ) }
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={ 5 } className="bg-transparent p-2"></td>
              <td className="flex justify-end bg-transparent p-2">
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={ () => append( { nombre: "", descripcion: "", unidadOperativa: "", responsable: "" } ) }
                >
                  <IoAddOutline /> Agregar
                </Button>
              </td>
            </tr>
          </tfoot>

        </table>
        <div className=" flex justify-center mt-4 " >


          <Button type="submit" disabled={ !form.formState.isDirty }>
            Guardar Procedimiento
          </Button>
        </div>
      </form>
    </Form>
  );
};