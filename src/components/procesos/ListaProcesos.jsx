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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      nivel: "",
      tipo: "",
      parentId: "", // Usa undefined para campos opcionales numéricos
    },
  } );

  const [ procesos, setProcesos ] = useState( [] );


  const cargarProcesos = useCallback( async () => {
    try {
      const data = await fetchConToken( 'procesos' );
      console.log( data );
      setProcesos( data.procesos );
    } catch ( error ) {
      console.error( 'Error fetching procesos:', error );
    }
  }, [] );

  useEffect( () => {
    cargarProcesos();
  }, [ cargarProcesos ] );

  const onSubmit = async ( values ) => {

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log( values );
    // Enviar los datos al servidor
    const respuesta = await fetchConToken( 'procesos/registrar', values, 'POST' );
    console.log( respuesta );
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

          <DialogContent className="sm:max-w-[425px] " aria-describedby="dialog-description" >
            <DialogHeader>
              <DialogTitle className="text-center">Nuevo Proceso</DialogTitle>
              <DialogDescription id="dialog-description">
                Complete los datos para crear un nuevo proceso.
              </DialogDescription>
            </DialogHeader>
            <Form { ...form }>
              <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8">

                <FormField
                  control={ form.control }
                  name="tipo"
                  render={ ( { field } ) => (
                    <FormItem >
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
                  name="nivel"
                  render={ ( { field } ) => (
                    <FormItem >
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
                    <FormItem >
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
                            procesos.map( proceso => (
                              <SelectItem key={ proceso.id } value={ proceso.id.toString() }>
                                { proceso.codigo } - { proceso.nombre }
                                <Button>delete</Button>
                              </SelectItem>
                            ) )
                          }
                        </SelectContent>
                      </Select>

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
              <span className="text-xs">  { proceso.codigo } - { proceso.nombre }</span>

            </div>
          ) )
        }
      </div>


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