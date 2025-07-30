import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { procedimientoSchema } from '@/schema/SchemaProcesos';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineDeleteOutline } from 'react-icons/md';

export const ProcedimientoProceso = ( { procedimiento } ) => {
  console.log( "Procedimiento:", procedimiento );

  const form = useForm( {
    resolver: zodResolver( procedimientoSchema ),
    defaultValues: {
      id: procedimiento.id || 1,
      actividades: procedimiento.actividades || [],
    },
    mode: "onChange",
  } );

  const { fields, append, remove, update } = useFieldArray( {
    control: form.control,
    name: "actividades",
  } );
  const onSubmit = ( data ) => {
    console.log( "Campos del formulario:", fields );
    console.log( "Datos del formulario:", data );
    // Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a tu API
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit( onSubmit ) } className="flex flex-col gap-6">
        <h3 className="text-lg font-bold">Actividades</h3>
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Nombre de actividad</th>
              <th className="p-2 border">Descripción de la actividad</th>
              <th className="p-2 border">Unidad Operativa</th>
              <th className="p-2 border">Responsable de la actividad</th>
              <th className="p-2 border">Acciones</th>
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
                  <td className="flex p-2 border ">
                    <Button type="button" variant="outline" onClick={ () => update( idx ) }>
                      <MdKeyboardArrowUp />
                    </Button>
                    <Button type="button" variant="destructive" onClick={ () => remove( idx ) }>
                      <MdOutlineDeleteOutline />
                    </Button>
                    <Button type="button" variant="outline" onClick={ () => update( idx ) }>
                      <MdKeyboardArrowDown />
                    </Button>
                  </td>
                </tr>
              ) )
            ) }
          </tbody>
        </table>

        <Button
          type="button"
          className="mt-4"
          onClick={ () => append( { nombre: "", descripcion: "", unidadOperativa: "", responsable: "" } ) }
        >
          Agregar Actividad
        </Button>

        <div className="mt-4">
          <Button type="submit" disabled={ !form.formState.isDirty }>
            Guardar Procedimiento
          </Button>
        </div>
      </form>
    </Form>
  );
};