import { useCallback,  useEffect, useState } from "react";
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
import { usuarioSchema } from '@/schema/UsuarioSchema';
import { fetchConToken } from '@/helpers/fetch';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthContext } from '@/auth/AuthContext';



export const UsuariosRegister = ( { onSubmit, initialValues } ) => {

 
  

  const [ roles, setRoles ] = useState( [] );

  const cargarRoles = useCallback( async () => {

    try {
      const respuesta = await fetchConToken( "rol" );

      console.log( { respuesta } );

      

      if ( respuesta.ok ) {
        setRoles( respuesta.roles );

      } else {
        setRoles( [] );
      }
    } catch ( error ) {
      setRoles( [] );
      console.error( "Error al cargar las unidades operativas: ", error );
    }
  }, [] );

  // Cargar owners al montar
  useEffect( () => {
    cargarRoles();
  }, [ cargarRoles ] );



  const form = useForm( {
    resolver: zodResolver( usuarioSchema ),
    defaultValues: {
      mapaId: initialValues?.mapaId || 0,
      nombre: initialValues?.nombre || "",
      apellidoPaterno: initialValues?.apellidoPaterno || "",
      apellidoMaterno: initialValues?.apellidoMaterno || "",
      correo: initialValues?.correo || "",
      rol: initialValues?.rol || 0,
      password: "",
      img: initialValues?.img || "",
    },
  } );

  useEffect( () => {
    if ( initialValues ) {
      form.reset( {
        mapaId: initialValues.mapaId || 0,
        nombre: initialValues?.nombre || "",
        apellidoPaterno: initialValues?.apellidoPaterno || "",
        apellidoMaterno: initialValues?.apellidoMaterno || "",
        correo: initialValues?.correo || "",
        rol: initialValues?.rol || 0,
        password: "",
        img: initialValues?.img || "",

      } );
    } else {
      form.reset( {
        mapaId: initialValues.mapaId || 0,
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        rol: 0,
        password: "",
        img: "",

      } );
    }
  }, [ initialValues, form ] );

// mostrar los erores del formulario en consola
  useEffect( () => {
    if ( form.formState.errors ) {
      console.log( form.formState.errors );
    }
  }, [ form.formState.errors ] );


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
            <FormItem style={ { position: "relative" } }>
              <FormLabel>Nombres</FormLabel>
              <Input
                placeholder="Registre los nombres del usuario..."
                { ...field }
              />

              <FormMessage />
            </FormItem>
          ) }
        />

        <FormField
          control={ form.control }
          name="apellidoPaterno"
          render={ ( { field } ) => (
            <FormItem>
              <FormLabel>Apellido Paterno</FormLabel>
              <FormControl>
                <Input placeholder="Registre el apellido paterno" { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />

        <FormField
          control={ form.control }
          name="apellidoMaterno"
          render={ ( { field } ) => (
            <FormItem>
              <FormLabel>Apellido Materno</FormLabel>
              <FormControl>
                <Input placeholder="Registre el apellido materno" { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="correo"
          render={ ( { field } ) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="Registre el correo electrónico" { ...field } type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="password"
          render={ ( { field } ) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese contraseña" { ...field } type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="rol"
          render={ ( { field } ) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={value => field.onChange(Number(value))} defaultValue={ field.value?.toString() }>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={0}> No Seleccionado</SelectItem>
                  {
                    roles.map( rol => (
                      <SelectItem key={ rol.id } value={ (rol.id).toString() }>{ rol.rol }</SelectItem>
                    ) )
                  }
                 
                </SelectContent>
              </Select>              
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
};