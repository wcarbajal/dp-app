
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapaSchema } from '@/schema/MapaSchema';
export const MapaForm = ({onSubmit, form}) => {

  return (
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
      <DialogFooter>
        <Button type="submit">Registrar</Button>
      </DialogFooter>
    </form>
  </Form>
  )
}