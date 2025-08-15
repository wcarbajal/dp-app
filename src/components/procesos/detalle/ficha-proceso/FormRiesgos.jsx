import { riesgosSchema } from '@/schema/FichaSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MdOutline1kPlus, MdOutlineAdd, MdOutlineDelete, MdOutlinePlusOne, MdOutlineSave } from 'react-icons/md';

export const FormRiesgos = () => {

  const form = useForm( {
    resolver: zodResolver( riesgosSchema ),
    defaultValues: {
      riesgos: [],
    },
  } );

  const { fields, append, remove } = useFieldArray( {
    control: form.control,
    name: "riesgos",
  } );


  const onSubmit = ( data ) => {
    console.log( data );
  };

  return (
    <FormProvider { ...form }>
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit( onSubmit ) } className="m-0 px-5 rounded-lg ">
          <table className=" border  bg-white rounded-lg w-full overflow-hidden">
            <thead>
              <tr className="bg-slate-100">
                <th>#</th>
                <th className="p-2 border">Riesgo</th>
                <th className="p-2 border w-25">Acciones</th>
              </tr>
            </thead>
            <tbody>
              { fields.map( ( field, idx ) => (
                <tr key={ field.id }>
                  <td className="p-2 border w-12 text-center">{ idx + 1 }</td>
                  <td className="p-2 border align-top">

                    <FormField
                      control={ form.control }
                      name={ `riesgos.${ idx }.denominacion` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Textarea { ...field } placeholder={ `Riesgo ${ idx + 1 }` } rows={ 2 } />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border  w-25">
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
                <td colSpan={ 3 } className="text-center">
                  <div className="flex flex-row justify-center items-center gap-2 my-2">
                    <Button variant="outline" type="button" onClick={ () => append( { denominacion: "" } ) }>
                      <MdOutlineAdd /> Agregar riesgo
                    </Button>
                    <Button type="submit" variant="default">
                      <MdOutlineSave /> Guardar riesgos
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