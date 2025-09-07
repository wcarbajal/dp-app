import { useEffect, useRef, useState } from "react";
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

import { cargarUnidadesOperativas } from '@/helpers/cargarUnidadesOperativas';




export default function OwnerFormRegister( { onSubmit, initialValues } ) {

  const [ search, setSearch ] = useState( "" );
  const [ showList, setShowList ] = useState( false );
  const [ unidadesOperativas, setUnidadesOperativas ] = useState( [] );

  const containerRef = useRef( null );

  useEffect( () => {
    function handleClickOutside( event ) {
      if ( containerRef.current && !containerRef.current.contains( event.target ) ) {
        setShowList( false );
      }
    }
    document.addEventListener( "mousedown", handleClickOutside );
    return () => {
      document.removeEventListener( "mousedown", handleClickOutside );
    };
  }, [] );

  useEffect( () => {
    const cargar = async () => {
      if ( !initialValues?.mapaId ) return;
      const unidades = await cargarUnidadesOperativas( initialValues.mapaId );
      setUnidadesOperativas( unidades );
    };
    cargar();
  }, [ initialValues?.mapaId ] );


  const form = useForm( {
    resolver: zodResolver( OwnerSchema ),
    defaultValues: {
      mapaId: initialValues?.mapaId || 0,
      oficina: initialValues?.unidadOperativa?.id.toString() || "",
      siglas: initialValues?.unidadOperativa?.siglas || "",
      director: initialValues?.director || "",
      correo: initialValues?.correo || "",
    },
  } );

  useEffect( () => {
    if ( initialValues ) {
      form.reset( {
        mapaId: initialValues.mapaId || 0,
        oficina: initialValues.unidadOperativa?.id.toString() || "",
        siglas: initialValues.unidadOperativa?.siglas || "",
        director: initialValues.director || "",
        correo: initialValues.correo || "",
      } );
    } else {
      form.reset( {
        mapaId: initialValues.mapaId || 0,
        oficina: "",
        siglas: "",
        director: "",
        correo: "",
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
          name="oficina"

          render={ ( { field } ) => (
            <FormItem style={ { position: "relative" } } ref={containerRef}>
              <FormLabel>Oficina</FormLabel>
              <Input
                placeholder="Buscar unidad operativa..."
                value={
                  // Si hay búsqueda, muestra el texto buscado; si no, muestra el nombre seleccionado
                  ( search !== "" ? search : unidadesOperativas.find( u => u.id.toString() === field.value )?.nombre ) || ""
                }
                onChange={ e => {
                  setSearch( e.target.value );
                  setShowList( true );
                  field.onChange( "" ); // Limpia la selección si el usuario empieza a buscar
                } }
                onClick={ () => setShowList( true ) }


                autoComplete="off"
              />
              { showList && (
                <ul
                  className="border rounded bg-white max-h-40 overflow-y-auto mt-16 shadow z-50"
                  style={ { position: "absolute", width: "100%", zIndex: 100 } }

                >
                  { unidadesOperativas
                    .filter( u =>
                      u.nombre.toLowerCase().includes( search.toLowerCase() )
                    )
                    .map( u => (
                      <li
                        key={ u.id }
                        className={ `px-3 py-1 cursor-pointer hover:bg-gray-100 ${ field.value === u.id.toString() ? "bg-gray-200" : ""
                          }` }
                        onMouseDown={ () => {
                          form.setValue( "oficina", u.id.toString() );
                          form.setValue( "siglas", u.siglas );
                          setSearch( u.nombre );
                          setShowList( false );
                        } }

                      >
                        { u.nombre }
                      </li>
                    ) ) }
                  { unidadesOperativas.filter( u =>
                    u.nombre.toLowerCase().includes( search.toLowerCase() )
                  ).length === 0 && (
                      <li className="px-3 py-1 text-gray-400">Sin resultados</li>
                    ) }
                </ul>
              ) }
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
                <Input placeholder="Siglas del owner" { ...field } disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="director"
          render={ ( { field } ) => (
            <FormItem>
              <FormLabel>Director</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del director" { ...field } />
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
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input placeholder="Correo electrónico" { ...field } />
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