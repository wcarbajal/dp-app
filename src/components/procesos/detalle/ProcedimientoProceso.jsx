import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { procedimientoSchema } from '@/schema/ProcesosSchema';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineDeleteOutline } from 'react-icons/md';
import { IoAddOutline } from "react-icons/io5";

import Swal from 'sweetalert2';
import { Table } from '@/components/ui/table';
import { FaRegSave } from 'react-icons/fa';
import { fetchConToken } from '@/helpers/fetch';

//TODO: cambiarlo a un proceso propio

export const ProcedimientoProceso = ( { actividades, idProceso, onActividadesActualizadas } ) => {

  // Normalizar actividades para evitar valores null
  const actividadesNormalizadas = (actividades || []).map(actividad => ({
    ...actividad,
    nombre: actividad?.nombre || "",
    descripcion: actividad?.descripcion || "",
    unidadOperativa: actividad?.unidadOperativa || "",
    responsable: actividad?.responsable || "",
    registro: actividad?.registro || "",
    numOrden: actividad?.numOrden || 1,
  }));

  const form = useForm( {
    resolver: zodResolver( procedimientoSchema ),
    defaultValues: {
      procesoId: idProceso || undefined,
      actividades: actividadesNormalizadas,
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

  const agregarRegistro = () => {
    append( {
      nombre: "",
      descripcion: "",
      unidadOperativa: "",
      responsable: "",
      registro: "",
      numOrden: fields.length + 1,
    } );
    
    // Marcar el formulario como dirty cuando se agrega un nuevo registro
    form.setValue("actividades", form.getValues("actividades"), { shouldDirty: true });
  };

  const onSubmit = async ( formulario ) => {
    console.log( formulario );
    
    try {
      // Enviar las actividades al backend
      const response = await fetchConToken(
        `procesos/${idProceso}/registrar-actividades`, 
        formulario, 
        'POST'
      );

      if (response.ok) {
        // Actualizar el formulario con los datos devueltos por el servidor
        if (response.actividadesActualizadas) {
          // Normalizar las actividades actualizadas
          const actividadesNormalizadasNuevas = response.actividadesActualizadas.map(actividad => ({
            ...actividad,
            nombre: actividad?.nombre || "",
            descripcion: actividad?.descripcion || "",
            unidadOperativa: actividad?.unidadOperativa || "",
            responsable: actividad?.responsable || "",
            registro: actividad?.registro || "",
            numOrden: actividad?.numOrden || 1,
          }));
          
          // Resetear el formulario con los datos actualizados
          form.reset({
            procesoId: idProceso,
            actividades: actividadesNormalizadasNuevas
          });
        }

        // Notificar al componente padre si existe la función callback
        if (onActividadesActualizadas && typeof onActividadesActualizadas === 'function') {
          onActividadesActualizadas();
        }

        // Mostrar mensaje de éxito
        await Swal.fire({
          title: 'Registro exitoso',
          text: 'Las actividades han sido registradas correctamente.',
          icon: 'success',
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
          }
        });

        //actujalis la tabla

        
      } else {
        // Mostrar mensaje de error
        Swal.fire({
          title: 'Error',
          text: response.msg || 'Ocurrió un error al registrar las actividades',
          icon: 'error',
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
          }
        });
      }
    } catch (error) {
      console.error('Error al enviar las actividades:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado al registrar las actividades',
        icon: 'error',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        }
      });
    }
  };  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit( onSubmit ) } className="flex flex-col gap-5">
        <h3 className="text-lg font-bold">Actividades</h3>
        <div className="w-full border rounded bg-white">
          {/* Tabla de encabezado fija */ }
          <table className="min-w-full rounded-lg overflow-hidden ">
            <colgroup>
              <col style={ { width: "60px" } } />
              <col style={ { width: "150px" } } />
              <col style={ { width: "300px" } } />
              <col style={ { width: "150px" } } />
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
                <th className="p-2 border">Registro de la actividad</th>
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
                      <td className="border align-middle text-center">
                        <span>
                          { idx + 1 }
                        </span>
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
                       <td className="p-2 border align-top">
                        <FormField
                          control={ form.control }
                          name={ `actividades.${ idx }.registro` }
                          render={ ( { field } ) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  { ...field }
                                  placeholder="Registro de la actividad"
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
          <div className="flex justify-center items-center  gap-5 p-2 ">
            <Button
              type="button"
              variant="outline"
              className=""
              onClick={ agregarRegistro }
            >
              <IoAddOutline /> Agregar
            </Button>
            <Button type="submit" disabled={ !form.formState.isDirty } >
              <FaRegSave /> Guardar 
            </Button>
          </div>
        </div>
       
      </form>
    </Form>
  );
};