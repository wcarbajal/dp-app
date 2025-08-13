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
import Swal from 'sweetalert2';

//TODO: cambiarlo a un proceso propio

export const ProcedimientoProceso = ( { actividades, idProceso } ) => {

  console.log( { actividades } );
  console.log( { idProceso } );




  const actividadesOrdenadas = ( actividades || [] ).slice().sort(
    ( a, b ) => Number( a.numOrden ) - Number( b.numOrden )
  ).map( ( a, i ) => ( {
    ...a,
    numOrden: a.numOrden ?? i + 1, // Si no tiene numOrden, asígnale uno correlativo
  } ) );

  console.log( { actividadesOrdenadas } );

  const form = useForm( {
    resolver: zodResolver( procedimientoSchema ),
    defaultValues: {
      id: idProceso || undefined,

      actividades: actividadesOrdenadas,
    },
    mode: "onChange",
  } );


  const { fields, append, remove, swap } = useFieldArray( {
    control: form.control,
    name: "actividades",
  } );

  const moveUp = ( idx ) => {
    if ( idx === 0 ) return;
    swap( idx, idx - 1 );
    // Actualiza numOrden después de swap
    const actividadesActualizadas = form.getValues( "actividades" ).map( ( item, i ) => ( {
      ...item,
      numOrden: i + 1,
    } ) );
    form.setValue( "actividades", actividadesActualizadas, { shouldDirty: true } );
  };

  const moveDown = ( idx ) => {
    if ( idx === fields.length - 1 ) return;
    swap( idx, idx + 1 );
    // Actualiza numOrden después de swap
    const actividadesActualizadas = form.getValues( "actividades" ).map( ( item, i ) => ( {
      ...item,
      numOrden: i + 1,
    } ) );
    form.setValue( "actividades", actividadesActualizadas, { shouldDirty: true } );
  };
  const onSubmit = async ( formulario ) => {
    // Ordena las actividades por numOrden antes de enviar
    const actividadesOrdenadas = [ ...formulario.actividades ].sort(
      ( a, b ) => Number( a.numOrden ) - Number( b.numOrden )
    );

    const result = await fetchConToken(
      `procesos/${ formulario.id }/registrar-actividades`,
      {
        id: formulario.id,
        actividades: actividadesOrdenadas,
      },
      "POST"
    );
    if ( !result.ok ) console.log( "Error en la respuesta:", result );
    if ( result.ok && result.proceso && Array.isArray( result.proceso.actividades ) ) {
      const actividadesOrdenadasResp = result.proceso.actividades.slice().sort(
        ( a, b ) => Number( a.numOrden ) - Number( b.numOrden )
      );
      form.setValue( "actividades", actividadesOrdenadasResp );
      Swal.fire( {
        title: "Actividades actualizadas!",
        text: "Las actividades fueron actualizadas correctamente!",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton: "bg-primary py-2 px-6 rounded-md text-primary-foreground shadow-xs hover:bg-primary/90",
        },
        buttonsStyling: false
      } );
    }
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit( onSubmit ) } className="flex flex-col gap-5">
        <h3 className="text-lg font-bold">Actividades</h3>
        <div className="w-full border rounded ">
          {/* Tabla de encabezado fija */ }
          <table className="min-w-full ">
            <colgroup>
              <col style={ { width: "60px" } } />
              <col style={ { width: "150px" } } />
              <col style={ { width: "300px" } } />
              <col style={ { width: "150px" } } />
              <col style={ { width: "150px" } } />
              <col style={ { width: "95px" } } />
            </colgroup>
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
          </table>
          {/* Tabla de cuerpo con scroll */ }
          <div className="max-h-96 overflow-y-auto w-full -mt-10">
            <table className="min-w-full">
              <colgroup>
                <col style={ { width: "60px" } } />
                <col style={ { width: "150px" } } />
                <col style={ { width: "300px" } } />
                <col style={ { width: "150px" } } />
                <col style={ { width: "150px" } } />
                <col style={ { width: "95px" } } />
              </colgroup>

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
                      <td className="border align-top">
                        <FormField
                          control={ form.control }
                          name={ `actividades.${ idx }.numOrden` }
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  { ...field }
                                  type="number"
                                  min={ 1 }
                                  placeholder="Orden"
                                  value={ field.value ?? idx + 1 }
                                  onChange={ e => {
                                    const value = e.target.value === "" ? "" : Number( e.target.value );
                                    field.onChange( value );
                                  } }
                                />

                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </td>
                      <td className="p-2 border align-top">
                        <FormField
                          control={ form.control }
                          name={ `actividades.${ idx }.nombre` }
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  { ...field }
                                  placeholder="Nombre de la actividad"
                                  className="break-words whitespace-pre-line resize-none"
                                  rows={ 2 }
                                />
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
                      <td className="p-2 border align-top">
                        <FormField
                          control={ form.control }
                          name={ `actividades.${ idx }.unidadOperativa` }
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  { ...field }
                                  placeholder="Nombre de la actividad"
                                  className="break-words whitespace-pre-line resize-none"
                                  rows={ 2 }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </td>
                      <td className="p-2 border align-top">
                        <FormField
                          control={ form.control }
                          name={ `actividades.${ idx }.responsable` }
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  { ...field }
                                  placeholder="Nombre de la actividad"
                                  className="break-words whitespace-pre-line resize-none"
                                  rows={ 2 }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          ) }
                        />
                      </td>
                      <td className="border w-[60px]">
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
            </table>
          </div>
          {/* Footer de la tabla */ }
          <div className="flex justify-end bg-transparent p-2">
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={ () => append( { numOrden: undefined, nombre: "", descripcion: "", unidadOperativa: "", responsable: "" } ) }
            >
              <IoAddOutline /> Agregar
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button type="submit"  >
            Guardar Procedimiento
          </Button>
        </div>
      </form>
    </Form>
  );
};