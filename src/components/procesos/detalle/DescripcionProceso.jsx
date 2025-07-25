import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { actualizarDescripcion } from '@/schema/SchemaProcesos';

// Esquema de validación con Zod

export const DescripcionProceso = ({ proceso, onSubmit: onSubmitProp }) => {
  const form = useForm({
    resolver: zodResolver(actualizarDescripcion),
    defaultValues: {
      codigo: proceso?.codigo || "",
      nombre: proceso?.nombre || "",
      tipo: proceso?.tipo || "",
      nivel: proceso?.nivel?.toString() || "0",
      descripcion: proceso?.descripcion || "",
    },
    mode: "onChange",
  });

  const onSubmit = (values) => {
    if (onSubmitProp) {
      onSubmitProp(values);
    } else {
      // Por defecto, solo muestra los datos en consola
      console.log("Datos actualizados:", values);
    }
  };

  return (
    <div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Código del proceso" {...field} />
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
                <Input placeholder="Nombre del proceso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estratégico">Estratégico</SelectItem>
                    <SelectItem value="Misional">Misional</SelectItem>
                    <SelectItem value="Soporte">Soporte</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nivel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nivel</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10).keys()].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción del proceso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Guardar Cambios
        </Button>
         </form>
    </Form>
    </div>
  );
};