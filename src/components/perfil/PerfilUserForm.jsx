import { AuthContext } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { perfilSchema } from '@/schema/Perfil';

// Esquema de validación con Zod


export const PerfilUserForm = ({ initialData, onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      name: initialData?.name || "",
      apellidoPaterno: initialData?.apellidoPaterno || "",
      apellidoMaterno: initialData?.apellidoMaterno || "",
      correo: initialData?.correo || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Guardar cambios
        </Button>
      </form>
    </Form>
  );
};