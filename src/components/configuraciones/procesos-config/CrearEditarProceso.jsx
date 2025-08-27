import { Button } from "@/components/ui/button";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MdOutlineExposurePlus1 } from "react-icons/md";

import { FormProcesoConfig } from './FormProcesoConfig';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { nuevoProcesoSchema } from '@/schema/ProcesosSchema';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchConToken } from '@/helpers/fetch';
import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectLabel, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { IoAddCircleOutline, IoPencilOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';

export const CreateEditProceso = ( { idMapa, listadoProcesos, proceso, cargarProcesos } ) => {

  const [ openDialog, setOpenDialog ] = useState( false );
  

  const form = useForm( {
    resolver: zodResolver( nuevoProcesoSchema ),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      nivel: "",
      tipo: "",
      idMapa: idMapa?.toString() || "",
      parentId: "",
    },
  } );

  const onSubmit = async ( values ) => {
    
    try {
      let respuesta;

      const valuesToSend = { ...values };
      if ( valuesToSend.parentId === "" ) {
        delete valuesToSend.parentId;
      }

      if ( proceso && proceso.id ) {

        respuesta = await fetchConToken( `procesos/${ proceso.id }/actualizar`, valuesToSend, "PUT" );
      } else {
        respuesta = await fetchConToken( `procesos/${ idMapa }/registrar`, valuesToSend, "POST" );
      }
      
      if ( respuesta.ok ) {


        setOpenDialog( false );
        Swal.fire( {
          title: "Éxito",
          text: "Proceso guardado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar"
        } );
        form.reset();
        if ( cargarProcesos ) {
          cargarProcesos();
        }

      } else {

        alert( "Error al guardar el proceso" );
      }
    } catch ( error ) {
      console.error( "Error al guardar proceso:", error );
    }
  };

  


  return (
    <Dialog open={ openDialog } onOpenChange={ setOpenDialog }>
      <DialogTrigger asChild>
        <Button onClick={ () => {
          if ( proceso && proceso.id ) {
            form.setValue( "codigo", proceso.codigo );
            form.setValue( "nombre", proceso.nombre );
            form.setValue( "descripcion", proceso.descripcion || "" );
            form.setValue( "nivel", proceso.nivel.toString() );
            form.setValue( "tipo", proceso.tipo );
            form.setValue( "parentId", proceso.parentId ? proceso.parentId.toString() : "" );
            form.setValue( "idMapa", proceso.mapaId.toString() || "" );
            setOpenDialog( true );
          }
        } }
        >
          { proceso && proceso.id
            ? ( <IoPencilOutline /> )
            : ( <><IoAddCircleOutline /> <span>Nuevo</span></> )
          }
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="text-lg font-boldt text-center">{ ( proceso && proceso.id ) ? "Editar Proceso" : "Nuevo Proceso" }</DialogTitle>
        </DialogHeader>
        <DialogDescription id="dialog-description">
          Complete los datos para crear o editar un proceso.
        </DialogDescription>


        <Form { ...form }>
          <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8">
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
                        listadoProcesos && listadoProcesos.length > 0 &&
                        [ ...listadoProcesos ]
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
            <Button type="submit" className="flex justify-self-end ">{ ( proceso && proceso.id ) ? "Actualizar Proceso" : "Registrar Proceso" }</Button>
          </form>
        </Form>


      </DialogContent>
    </Dialog>

  );
};