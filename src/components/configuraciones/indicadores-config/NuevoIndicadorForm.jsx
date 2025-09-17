import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { nuevoIndicadorSchema } from '@/schema/InidicadorSchema';
import { useEffect } from 'react';
import { fetchConToken } from '@/helpers/fetch';


export const NuevoIndicadorForm = ( { mapaId, indicadoresList } ) => {

  console.log( { indicadoresList } );




  const form = useForm( {
    resolver: zodResolver( nuevoIndicadorSchema ),
    defaultValues: {
      codigo: "",
      nombre: "",
      tipoNivel: "",
      parentId: null,
      mapaId: mapaId || null,
    },
  } );

  // Escucha cambios en tipoNivel y actualiza el código
  const tipoNivel = form.watch( "tipoNivel" );
  // Nuevo campo para la parte editable del código
  const codigoSufijo = form.watch( "codigoSufijo" ) || "";
  console.log( { tipoNivel } );

  // Cuando cambia tipoNivel, actualiza el código automáticamente
  // Puedes personalizar la lógica para construir el código aquí
  // Actualiza el valor de "codigo" cada vez que cambia tipoNivel o codigoSufijo
  useEffect( () => {
    if ( tipoNivel ) {
      form.setValue( "codigo", `${ tipoNivel }.${ codigoSufijo }` );
    } else {
      form.setValue( "codigo", "" );
    }
  }, [ tipoNivel, codigoSufijo, form ] );


  const onSubmit = async ( data ) => {
    
    console.log( data );

    const respuesta = await fetchConToken( `indicador/${mapaId}`, data, 'POST' );

    console.log( { respuesta } );
  };

  return (
    <DialogHeader>
      <DialogTitle>Registrar nuevo indicador</DialogTitle>
      <DialogDescription>
        Completa los datos para crear un nuevo indicador.
      </DialogDescription>
      <Form { ...form }>
        <form
          onSubmit={ form.handleSubmit( onSubmit ) }
          className="space-y-3 mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={ form.control }
              name="tipoNivel"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Tipo de Nivel</FormLabel>
                  <FormControl>
                    <select { ...field } className="w-full border rounded p-2">
                      <option value="">...</option>
                      <option value="OEI">OEI</option>
                      <option value="AEI">AEI</option>
                      <option value="IO">IO</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            />

            <FormField
              control={ form.control }
              name="codigoSufijo"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Correlativo de indicador</FormLabel>
                  <FormControl>
                    <Input { ...field } autoFocus placeholder="Ingrese el sufijo del código" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            />
          </div>
          <FormField
            control={ form.control }
            name="codigo"
            render={ ( { field } ) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input { ...field } readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />

          <FormField
            control={ form.control }
            name="nombre"
            render={ ( { field } ) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input { ...field } />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />

          <FormField
            control={ form.control }
            name="parentId"
            render={ ( { field } ) => (
              <FormItem>
                <FormLabel>Tipo de Nivel</FormLabel>
                <FormControl>
                  <select { ...field } className="w-full border rounded p-2">
                    <option value="">Sin padre</option>
                    { indicadoresList && indicadoresList.map( indicador => (
                      <option key={ indicador.id } value={ indicador.id }>{ indicador.codigo } - { indicador.nombre }</option>
                    ) )

                    }
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />
          {/* Agrega aquí más campos según tu schema */ }
          <Button type="submit" className="w-full mt-2">
            Registrar
          </Button>
        </form>
      </Form>
    </DialogHeader>
  );
};