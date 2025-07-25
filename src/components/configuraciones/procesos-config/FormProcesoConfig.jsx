import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export const FormProcesoConfig = ( { form, handleSubmit, procesos, editId } ) => {
  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit( handleSubmit ) } className="space-y-8">
        <FormField
          control={ form.control }
          name="tipo"
          render={ ( { field } ) => (
            <FormItem className="mb-4">
              <FormLabel >Tipo de proceso</FormLabel>
              <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Estratégico">Estratégico</SelectItem>
                  <SelectItem value="Misional">Misional</SelectItem>
                  <SelectItem value="Soporte">Soporte</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          ) }
        />
        <div className="grid grid-cols-3 gap-4 m-0">
          <FormField
            control={ form.control }
            name="codigo"
            render={ ( { field } ) => (
              <FormItem className="mb-4 col-span-2">
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código del proceso" { ...field } />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />
          <FormField
            control={ form.control }
            name="nivel"
            render={ ( { field } ) => (
              <FormItem className="mb-4">
                <FormLabel >Nivel de proceso</FormLabel>
                <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un nivel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            ) }
          />

        </div>
        <FormField
          control={ form.control }
          name="nombre"
          render={ ( { field } ) => (
            <FormItem className="mb-4">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del proceso" { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />


        <FormField
          control={ form.control }
          name="descripcion"
          render={ ( { field } ) => (
            <FormItem className="mb-4">
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción del proceso" { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />

        <FormField
          control={ form.control }
          name="parentId"
          render={ ( { field } ) => (
            <FormItem className="mb-4">
              <FormLabel >Proceso padre (opcional)</FormLabel>
              <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    procesos && procesos.length > 0 &&
                    [ ...procesos ]
                      .sort( ( a, b ) => a.codigo.localeCompare( b.codigo ) )
                      .map( proceso => (
                        <SelectItem key={ proceso.id } value={ proceso.id.toString() }>
                          { proceso.codigo } - { proceso.nombre }
                        </SelectItem>
                      ) )
                  }
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          ) }
        />
        <Button type="submit" className="flex justify-self-end ">{ editId ? "Actualizar Proceso" : "Registrar Proceso" }</Button>
      </form>
    </Form>
  );
};