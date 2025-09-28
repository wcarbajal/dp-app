import { entradaSalidaSchema } from '@/schema/FichaSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { MdOutlineDelete, MdOutlineEdit, MdOutlineAdd, MdOutlineSave } from 'react-icons/md';
import { fetchConToken } from '@/helpers/fetch';
import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export const FormEntradasSalidas = ( { proceso } ) => {


  const [ ioResult, setIoResult ] = useState( [] );

  const cargarInputOutput = useCallback( async () => {

    if ( !proceso || !proceso.ficha || !proceso.ficha.id ) {

      setIoResult( [] );
      return;
    }
    const response = await fetchConToken( `ficha/${ proceso.ficha.id }/input-output` );

    if ( response.ok ) {
      setIoResult( response.inputOutput );
    } else {
      setIoResult( [] ); // Para evitar undefined
    }
  }, [ proceso ] );

  useEffect( () => {
    cargarInputOutput();
  }, [ proceso, cargarInputOutput ] );

  const form = useForm( {
    resolver: zodResolver( entradaSalidaSchema ),
    defaultValues: {
      inputOutput: []
    },
  } );

  useEffect( () => {
    if ( ioResult !== undefined ) {
      form.reset( {
        inputOutput: ioResult.length
          ? ioResult.map( item => ( {
            id: item.id,
            proveedor: item.proveedor,
            entrada: item.entrada,
            salida: item.salida,
            cliente: item.cliente,
          } ) )
          : [],
      } );
    }
  }, [ ioResult, form ] );

  const { fields, append, remove } = useFieldArray( {
    control: form.control,
    name: "inputOutput",
  } );



  const onSubmit = async ( data ) => {


    let fichaId;
    console.log( "proceso en onsubmit", proceso?.ficha );



    if ( !proceso?.ficha ) {

      console.log( "registrando ficha nueva" );
      const fichaNueva = await fetchConToken( `procesos/${ proceso.id }/registrar-ficha` );
      console.log( { fichaNueva } );


      fichaId = fichaNueva.id;
    } else {

      console.log( " ficha existente" );
      fichaId = proceso.ficha.id;
    }
    const dataSend = { fichaId, ...data };
    console.log( "data a enviar", dataSend );

    const response = await fetchConToken( `ficha/${ fichaId }/registrar-io`, dataSend, 'POST' );

    if ( response.ok ) {
      setIoResult( response.inputOutput );
      cargarInputOutput();

      await Swal.fire( {
        title: 'Registro exitoso',
        text: "Las entradas y salidas fueron registradas correctamente.",
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
    <FormProvider { ...form } >
      <Form { ...form } >
        <form onSubmit={ form.handleSubmit( onSubmit, ( errors ) => {
          console.error( 'Errores en el formulario:', errors );
        } ) } className="px-5 rounded-lg ">
          <table className="border rounded-lg overflow-hidden bg-white w-full">
            <colgroup>
              <col className="w-12" /> {/* # */ }
              <col className="w-1/5" />  {/* Proveedor */ }
              <col className="w-1/4" />  {/* Entrada */ }
              <col className="w-1/4" />  {/* Salida */ }
              <col className="w-1/5" />  {/* Clientes */ }
              <col className="w-24" />   {/* Acciones */ }
            </colgroup>
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Proveedor</th>
                <th className="p-2 border">Entrada</th>
                <th className="p-2 border">Salida</th>
                <th className="p-2 border">Clientes</th>
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
                      name={ `inputOutput.${ idx }.proveedor` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Textarea { ...field } placeholder="Proveedor" rows={ 2 } />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={ form.control }
                      name={ `inputOutput.${ idx }.entrada` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Textarea { ...field } placeholder="Entradas" rows={ 2 } />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={ form.control }
                      name={ `inputOutput.${ idx }.salida` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Textarea { ...field } placeholder="Salidas" rows={ 2 } />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={ form.control }
                      name={ `inputOutput.${ idx }.cliente` }
                      render={ ( { field } ) => (
                        <FormItem>
                          <FormControl>
                            <Textarea { ...field } placeholder="Clientes" rows={ 2 } />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) }
                    />
                  </td>
                  <td className="p-2 border align-top">
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={ () => remove( idx ) }
                      /* disabled={ fields.length === 1 } */
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
                <td colSpan={ 6 } className="text-right">

                  <div className="flex flex-row justify-center items-center gap-2 my-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={ () =>
                        append( {
                          id: undefined,
                          proveedor: "",
                          entrada: "",
                          salida: "",
                          cliente: "",
                        } )
                      }
                    >
                      <MdOutlineAdd />  Agregar
                    </Button>
                    <Button type="submit" disabled={ !form.formState.isDirty }>
                      <MdOutlineSave /> Guardar
                    </Button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>

        </form>
      </Form>
    </FormProvider >
  );
};