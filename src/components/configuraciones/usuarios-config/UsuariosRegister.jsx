import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OwnerSchema } from '@/schema/OwnerSchema';

//import { cargarUnidadesOperativas } from '@/helpers/cargarUnidadesOperativas';
import { UnidadFuncionalSchema } from '@/schema/UnidadFuncionalSchema';



export const UsuariosRegister = ( { onSubmit, initialValues } ) => {

  const containerRef = useRef( null );


  const form = useForm( {
    resolver: zodResolver( UnidadFuncionalSchema ),
    defaultValues: {
      mapaId: initialValues?.mapaId || 0,
      nombre: initialValues?.nombre || "",
      siglas: initialValues?.siglas || "",
      
    },
  } );

  useEffect( () => {
    if ( initialValues ) {
      form.reset( {
        mapaId: initialValues.mapaId || 0,
        nombre: initialValues?.nombre || "",
        siglas: initialValues?.siglas || "",
        
      } );
    } else {
      form.reset( {
        mapaId: initialValues.mapaId || 0,
        oficina: "",
        siglas: "",
        
      } );
    }
  }, [ initialValues, form ] );

  


  return (
    <Form { ...form }>
      <form
        className="flex flex-col gap-4 mt-2"
        onSubmit={ form.handleSubmit( onSubmit ) }
      >
        <FormField
          control={ form.control }
          name="nombre"

          render={ ( { field } ) => (
            <FormItem style={ { position: "relative" } } ref={containerRef}>
              <FormLabel>Unidad operativa</FormLabel>
              <Input
                placeholder="Registre  el nombre de la unidad operativa..." 
                 { ...field }
              />
             
              <FormMessage />
            </FormItem>
          ) }
        />

        <FormField
          control={ form.control }
          name="siglas"
          render={ ( { field } ) => (
            <FormItem>
              <FormLabel>Siglas</FormLabel>
              <FormControl>
                <Input placeholder="Siglas de la unidad operativa" { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />
      
      
        <Button type="submit" disabled={ form.formState.isSubmitting }>
          Guardar
        </Button>
      </form>
    </Form>
  );
}