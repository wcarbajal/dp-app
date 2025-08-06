import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactSelect from 'react-select';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { actualizarProcesoSchema } from '@/schema/ProcesosSchema';
import { fetchConToken } from '@/helpers/fetch';
import Swal from 'sweetalert2';

export const DescripcionProceso = ( { proceso, onSubmit: onSubmitProp, ownersOptions } ) => {



  const form = useForm( {
    resolver: zodResolver( actualizarProcesoSchema ),
    defaultValues: {
      codigo: proceso?.codigo || "",
      nombre: proceso?.nombre || "",
      descripcion: proceso?.descripcion || "",
      nivel: proceso?.nivel !== undefined && proceso?.nivel !== null
        ? String( proceso.nivel )
        : "0",
      tipo: proceso?.tipo || "",
      objetivo: proceso?.objetivo || "",
      alcance: proceso?.alcance || "",
      estrategico: proceso?.estrategico || "",
      owners: proceso?.owners?.map( d => d.id.toString() ) || [],
    },
    mode: "onChange",
  } );



  const onSubmit = async ( values ) => {


    if ( onSubmitProp ) {
      onSubmitProp( values );
    } else {
      // Por defecto, solo muestra los datos en consola
      const actualizarProceso = await fetchConToken( `procesos/descripcion/${ proceso.id }`, values, "PUT" );

      if ( actualizarProceso.ok ) {

        Swal.fire( {
          title: "Proceso actualizado!",
          text: "El proceso fue actualizado correctamente!",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "bg-primary py-2 px-6 rounded-md text-primary-foreground shadow-xs hover:bg-primary/90",

          },
          buttonsStyling: false // Esto es clave para que se apliquen tus clases
        } );
      }
      form.reset( values );
    }
  };

  return (
    <Card className="flex w-full  shadow-lg">

      <CardHeader className="">
        <CardTitle>Descripción del Proceso</CardTitle>
        <CardDescription>Datos generales del proceso</CardDescription>

      </CardHeader>

      <CardContent>

        <Form { ...form }>
          <form onSubmit={ form.handleSubmit( onSubmit ) } className="flex flex-col gap-4 w-full ">
            <div className="grid grid-cols-2 gap-4">

              <FormField
                control={ form.control }
                name="codigo"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-24">Código</FormLabel>
                    <FormControl className="w-full bg-slate-100">
                      <Input className="w-full" placeholder="Código del proceso" readOnly { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />

              <FormField
                control={ form.control }
                name="nombre"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-24">Nombre</FormLabel>
                    <FormControl className="w-full bg-slate-100">
                      <Input className="w-full" readOnly placeholder="Nombre del proceso" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />

              <FormField
                control={ form.control }
                name="tipo"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-24">Tipo</FormLabel>
                    <FormControl className="w-full">
                      <Select onValueChange={ field.onChange } value={ field.value }>
                        <SelectTrigger className="w-full">
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
                ) }
              />

              <FormField
                control={ form.control }
                name="nivel"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-24">Nivel</FormLabel>
                    <FormControl className="w-full">
                      <Select onValueChange={ field.onChange } value={ field.value }>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          { [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ].map( ( n ) => (
                            <SelectItem key={ n } value={ n }>
                              { n }
                            </SelectItem>
                          ) ) }
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />

              <FormField
                control={ form.control }
                name="descripcion"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-24">Descripción</FormLabel>
                    <FormControl className="w-full">
                      <Input className="w-full" placeholder="Descripción del proceso" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />

              <FormField
                control={ form.control }
                name="objetivo"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-24">Objetivo</FormLabel>
                    <FormControl className="w-full">
                      <Input className="w-full" placeholder="Objetivo del proceso" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="alcance"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-24">Alcance</FormLabel>
                    <FormControl className="w-full">
                      <Input className="w-full" placeholder="Alcance del proceso" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="estrategico"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-24">Objetivos Estratégicos</FormLabel>
                    <FormControl className="w-full">
                      <Input className="w-full" placeholder="Objetivos Estratégico del proceso" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="owners"
                render={ ( { field } ) => (
                  <FormItem className="flex items-center col-span-2">
                    <FormLabel className="w-24">Dueños</FormLabel>
                    <FormControl className="w-full">
                      <ReactSelect
                        isMulti
                        options={ ownersOptions.map( d => ( { value: d.id.toString(), label: d.oficina } ) ) }
                        value={
                          Array.isArray( field.value )
                            ? ownersOptions
                              .filter( d => field.value.includes( d.id.toString() ) )
                              .map( d => ( { value: d.id.toString(), label: d.oficina } ) )
                            : []
                        }
                        onChange={ selected => {
                          field.onChange( selected ? selected.map( option => option.value ) : [] );
                        }
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />


            </div>
            <div className="flex justify-center ">
              <Button type="submit" disabled={ !form.formState.isDirty }>
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

    </Card>
  );
};