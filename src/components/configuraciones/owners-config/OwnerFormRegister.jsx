import { useEffect } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OwnerSchema } from '@/schema/OwnerSchema';



export default function OwnerFormRegister({ onSubmit, initialValues }) {
  
  const form = useForm({
    resolver: zodResolver(OwnerSchema),
    defaultValues: {
      oficina: initialValues?.oficina || "",
      siglas: initialValues?.siglas || "",
      director: initialValues?.director || "",
      correo: initialValues?.correo || "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        oficina: initialValues.oficina || "",
        siglas: initialValues.siglas || "",
        director: initialValues.director || "",
        correo: initialValues.correo || "",
      });
    } else {
      form.reset({
        oficina: "",
        siglas: "",
        director: "",
        correo: "",
      });
    }
  }, [initialValues, form]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 mt-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >      
        <FormField
          control={form.control}
          name="oficina"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Oficina</FormLabel>
              <FormControl>
                <Input placeholder="Oficina del owner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="siglas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Siglas</FormLabel>
              <FormControl>
                <Input placeholder="Siglas del owner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="director"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Director</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del director" {...field} />
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
                <Input placeholder="Correo electrónico" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Guardar
        </Button>
      </form>
    </Form>
  );
}