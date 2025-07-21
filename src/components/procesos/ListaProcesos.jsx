import { fetchConToken } from '@/helpers/fetch';
import { useCallback, useEffect, useState } from 'react';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


import { Button } from '../ui/button';
import { IconPlus } from '@tabler/icons-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from '../ui/input';
import { nuevoProcesoSchema } from './schema/SchemaProcesos';


export const ListaProcesos = () => {

  const form = useForm( {
    resolver: zodResolver( nuevoProcesoSchema ),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      parentId: "", // Usa undefined para campos opcionales numéricos
    },
  } );

  const [ procesos, setProcesos ] = useState( [] );
  /* const [ nuevoProceso, setNuevoProceso ] = useState( {
    
    codigo: '',
    nombre: '',
    descripcion: '',
    parentId: ''
  } ); */

  const cargarProcesos = useCallback(async () => {
    try {
      const data = await fetchConToken('procesos');
      console.log(data)
      setProcesos(data.procesos);
    } catch (error) {
      console.error('Error fetching procesos:', error);
    }
  }, []);

  useEffect(() => {
    cargarProcesos();
  }, [cargarProcesos]);

  const onSubmit = ( values ) => {

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log( values );
  };

  return (
    <>
      <div className="flex justify-between align-center  p-2  rounded-lg"
      >
        <h1 className="flex self-center font-bold  -m-2">Procesos</h1>
        <Dialog>

          <DialogTrigger asChild>
            <Button variant="outline" className="w-9 h-9 p-0 m-0">
              <IconPlus className="" />
            </Button>
          </DialogTrigger>
         
          <DialogContent className="sm:max-w-[425px]">
             <DialogHeader>
            <DialogTitle className="text-center">Nuevo Proceso</DialogTitle>
          </DialogHeader>
            <Form { ...form }>
              <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8">
                <FormField
                  control={ form.control }
                  name="codigo"
                  render={ ( { field } ) => (
                    <FormItem>
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
                  name="nombre"
                  render={ ( { field } ) => (
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>ID Padre (opcional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ID del proceso padre" { ...field } />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
                <Button type="submit">Agregar Proceso</Button>
              </form>
            </Form>
          </DialogContent>

        </Dialog>
      </div >


      <div>
        {
          // ordenar la lista segun el codigo
          procesos && procesos.length > 0 &&
          procesos.sort( ( a, b ) => a.codigo.localeCompare( b.codigo ) ).map( proceso => (

            <div key={ proceso.id } className="">
              <span className="text-xs">{ proceso.codigo } - { proceso.nombre }</span>

            </div>
          ) )
        }
      </div>;


      {/*  <div className="p-2">
        <h2 className="text-lg font-semibold">Nuevo Proceso</h2>
        <form onSubmit={ handleSubmit }>
          <input
            type="text"
            placeholder="Nombre"
            value={ nuevoProceso.nombre }
            onChange={ ( e ) => setNuevoProceso( { ...nuevoProceso, nombre: e.target.value } ) }
            required
          />
          <textarea
            placeholder="Descripción"
            value={ nuevoProceso.descripcion }
            onChange={ ( e ) => setNuevoProceso( { ...nuevoProceso, descripcion: e.target.value } ) }
            required
          />
          <button type="submit">Agregar Proceso</button>
        </form>
      </div> */}
    </>
  );
};