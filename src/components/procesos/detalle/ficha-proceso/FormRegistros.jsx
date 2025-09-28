import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrosSchema } from "@/schema/FichaSchema";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MdOutlineAdd, MdOutlineDelete, MdOutlineSave } from 'react-icons/md';
import { useCallback, useEffect, useState } from 'react';
import { fetchConToken } from '@/helpers/fetch';
import Swal from 'sweetalert2';

export const FormRegistros = ( { proceso } ) => {



  const [ registros, setRegistros ] = useState( [] );

  const cargarRegistros = useCallback( async () => {

    if ( !proceso || !proceso.ficha || !proceso.ficha.id ) {

      setRegistros( [] );
      return;
    }
    const response = await fetchConToken( `ficha/${ proceso.ficha.id }/registros` );

    if ( response.ok ) {
      setRegistros( response.registros );
    } else {
      setRegistros( [] ); // Para evitar undefined
    }
  }, [ proceso ] );

  useEffect( () => {
    cargarRegistros();
  }, [ proceso, cargarRegistros ] );



  const form = useForm( {
    resolver: zodResolver( registrosSchema ),
    defaultValues: {
      registros: [],
    },
  } );

  useEffect( () => {

    if ( registros !== undefined ) {
      form.reset( {
        registros: registros.length
          ? registros.map( item => ( {
            id: item.id,
            denominacion: item.denominacion,
            tipoRegistro: item.tipoRegistro,
          } ) )
          : [],
      } );
    }
  }, [ registros, form ] );

  const { fields, append, remove } = useFieldArray( {
    control: form.control,
    name: "registros",
  } );

  const onSubmit = async ( data ) => {



    let fichaId;

    if ( proceso?.ficha === null ) {

      const fichaNueva = await fetchConToken( `procesos/${ proceso.id }/registrar-ficha` );
      fichaId = fichaNueva.id;
    } else {
      fichaId = proceso.ficha.id;
    }

    const response = await fetchConToken( `ficha/${ fichaId }/registrar-registros`, data, 'POST' );

    if ( response.ok ) {
      setRegistros( response.registros );
      cargarRegistros();

      await Swal.fire( {
        title: 'Registro exitoso',
        text: "Registro completo.",
        icon: 'success',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        }
      } );

    } else {
      console.error( 'Error al registrar Input/Output' );
    }
  };


  return (
    <FormProvider { ...form }>
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit( onSubmit ) } className="m-0  rounded-lg px-5">
          <table className=" border  bg-white rounded-lg w-full overflow-hidden">
            <colgroup>
              <col className="w-12" /> {/* # */ }
              <col className="" />  {/* Proveedor */ }
              <col className="" />  {/* Entrada */ }
              <col className="w-24" />   {/* Acciones */ }
            </colgroup>
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
                      name={ `registros.${ idx }.tipoRegistro` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={ field.value }
                              onValueChange={ field.onChange }
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
                    <Button variant="outline" type="button" onClick={ () => append( { denominacion: "", tipoRegistro: "físico" } ) }>
                      <MdOutlineAdd /> Agregar registro
                    </Button>
                    <Button type="submit" disabled={ !form.formState.isDirty }>

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