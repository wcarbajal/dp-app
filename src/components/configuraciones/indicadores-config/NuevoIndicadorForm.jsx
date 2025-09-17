import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { nuevoIndicadorSchema } from '@/schema/InidicadorSchema';


export const NuevoIndicadorForm = ({mapaId, indicadoresList}) => {

  console.log({indicadoresList});
  

  const form = useForm({
    resolver: zodResolver(nuevoIndicadorSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      tipoNivel: "",
      parentId: null,
      mapaId: mapaId || null,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <DialogHeader>
      <DialogTitle>Registrar nuevo indicador</DialogTitle>
      <DialogDescription>
        Completa los datos para crear un nuevo indicador.
      </DialogDescription>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 mt-4"
        >
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipoNivel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Nivel</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded p-2">
                    <option value="">Selecciona...</option>
                    <option value="OEI">OEI</option>
                    <option value="AEI">AEI</option>
                    <option value="IO">IO</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Nivel</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded p-2">
                    <option value="">Selecciona...</option>
                    { indicadoresList && indicadoresList.map( indicador => (
                      <option key={ indicador.id } value={ indicador.id }>{ indicador.nombre }</option>
                    ) )

                    }
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Agrega aquí más campos según tu schema */}
          <Button type="submit" className="w-full mt-2">
            Registrar
          </Button>
        </form>
      </Form>
    </DialogHeader>
  );
};