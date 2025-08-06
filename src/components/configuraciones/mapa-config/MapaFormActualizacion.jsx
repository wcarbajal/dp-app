
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fetchConToken } from '@/helpers/fetch';
import { MapaSchema } from '@/schema/MapaSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const MapaFormActualizacion = ( { mapaSeleccionado, cargarMapas, setOpen } ) => {

  const form = useForm( {
    resolver: zodResolver( MapaSchema ),
    defaultValues: {
      ruc: mapaSeleccionado.ruc,
      nombre: mapaSeleccionado.nombre,
      entrada: mapaSeleccionado.entrada,
      salida: mapaSeleccionado.salida,
      descripcion: mapaSeleccionado.descripcion || ""
    },
  } );

  const onSubmit = async ( values ) => {
    try {
     
      const respuesta = await fetchConToken( `mapa/actualizar/${ mapaSeleccionado.id }`, values, "PUT" );

      if ( respuesta.ok ) {
       
        setOpen( false );
        cargarMapas();
      } else {
        console.error( "Error al actualizar el mapa:", respuesta.error );
      }
      cargarMapas();
    } catch ( error ) {
      console.error( "Error al actualizar el mapa:", error );
    }
  };

  return (

    <div className="space-y-4">

      <Form { ...form }>
        <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-4">
          <FormField
            control={ form.control }
            name="ruc"
            render={ ( { field } ) => (
              <FormItem>
                <FormLabel>RUC</FormLabel>
                <FormControl>
                  <Input { ...field } placeholder="RUC del mapa" />
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
                <FormLabel>Nombre del mapa</FormLabel>
                <FormControl>
                  <Input { ...field } placeholder="Nombre del mapa" />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />
          <FormField
            control={ form.control }
            name="entrada"
            render={ ( { field } ) => (
              <FormItem>
                <FormLabel>Entrada</FormLabel>
                <FormControl>
                  <Textarea { ...field } placeholder="Entrada" rows={ 2 } />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />
          <FormField
            control={ form.control }
            name="salida"
            render={ ( { field } ) => (
              <FormItem>
                <FormLabel>Salida</FormLabel>
                <FormControl>
                  <Textarea { ...field } placeholder="Salida" rows={ 2 } />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />
           <FormField
            control={ form.control }
            name="descripcion"
            render={ ( { field } ) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea { ...field } placeholder="Salida" rows={ 2 } />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />
          <DialogFooter>
            <Button type="submit">Actualizar Mapa</Button>
          </DialogFooter>
        </form>
      </Form>

    </div>
  );
};