import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrosSchema } from "@/schema/FichaSchema";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MdOutlineAdd, MdOutlineDelete, MdOutlineSave } from 'react-icons/md';

export const FormRegistros = () => {
  const form = useForm( {
    resolver: zodResolver( registrosSchema ),
    defaultValues: {
      registros: [  ],
    },
  } );

  const { fields, append, remove } = useFieldArray( {
    control: form.control,
    name: "registros",
  } );

  const onSubmit = ( data ) => {
    console.log( data );
  };

  return (
    <FormProvider { ...form }>
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit( onSubmit ) } className="m-0  rounded-lg px-5">
          <table className=" border  bg-white rounded-lg w-full overflow-hidden">
            <thead>
              <tr className="bg-slate-100">
                <th>#</th>
                <th className="p-2 border">Registro</th>
                <th className="p-2 border">Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              { fields.map( ( field, idx ) => (
                <tr key={ field.id }>
                  <td className="p-2 border">{ idx + 1 }</td>
                  <td className="p-2 border align-top">

                    <FormField
                      control={ form.control }
                      name={ `registros.${ idx }.denominacion` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Textarea { ...field } placeholder={ `Registro ${ idx + 1 }` } rows={ 2 } />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>

                  <td className="p-2 border align-top">

                    <FormField
                      control={ form.control }
                      name={ `registros.${ idx }.tipo` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            {/* <Textarea {...field} placeholder={`Tipo ${idx + 1}`} rows={2} /> */ }
                            <Select
                              { ...field }
                              placeholder={ `Tipo ${ idx + 1 }` }
                              value={ field.value }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione un tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="físico">Físico</SelectItem>
                                <SelectItem value="digital">Digital</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border w-25">
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={ () => remove( idx ) }
                        
                      >
                        <MdOutlineDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ) ) }
            </tbody>
            <tfoot>
              <tr className="p-2 border">
                <td colSpan={ 4 } className="text-right">
                  <div className="flex flex-row justify-center items-center gap-2 my-2">
                    <Button variant="outline" type="button" onClick={ () => append( { denominacion: "", tipo: "" } ) }>
                      <MdOutlineAdd /> Agregar registro
                    </Button>
                    <Button type="submit">

                      <MdOutlineSave /> Guardar registros
                    </Button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </form>
      </Form>
    </FormProvider>
  );
};