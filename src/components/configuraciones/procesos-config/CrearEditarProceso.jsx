import { Button } from "@/components/ui/button";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MdOutlineExposurePlus1 } from "react-icons/md";


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

    console.log( "Submitting form with values:", values );

    try {
      let respuesta;

      console.log( { respuesta } );

      const valuesToSend = { ...values };
      console.log( "valuesToSend before adjustment:", valuesToSend );

      if ( valuesToSend.parentId === "" ) {
        delete valuesToSend.parentId;
      }

      console.log( { proceso } );

      if ( proceso && proceso.id ) {

        respuesta = await fetchConToken( `procesos/${ proceso.id }/actualizar`, valuesToSend, "PUT" );
      } else {
        respuesta = await fetchConToken( `procesos/${ idMapa }/registrar`, valuesToSend, "POST" );
        console.log( { respuesta } );
      }

      if ( respuesta.ok ) {

        setOpenDialog( false );
        Swal.fire( {
          title: "Éxito",
          text: "Proceso guardado correctamente",
          icon: "success",
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 z-10',
          }
        } );
        form.reset();
        if ( cargarProcesos ) {
          cargarProcesos();
        }

      } else {
        setOpenDialog( false );
        await Swal.fire( {
          title: "Ha ocurrido un error al crear el indicador.",
          text: `Error: ${ respuesta.msg || 'No se pudo crear el indicador' }`,
          icon: 'error',
          confirmButtonColor: '#2A2A2A',
          confirmButtonText: 'Regresar',
          customClass: {
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 z-10',
          }
        } );
        setOpenDialog( true );
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
      <DialogContent aria-describedby="dialog-description" className="  ">

        <DialogHeader>
          <DialogTitle className="text-lg font-boldt text-center">{ ( proceso && proceso.id ) ? "Editar Proceso" : "Nuevo Proceso" }</DialogTitle>
          <DialogDescription>
            Complete los datos para crear o editar un proceso.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-w-[500px] w-full ">
          <Form { ...form }>
            <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8 w-full">
              {/* ...otros campos... */ }
              <FormField
                control={ form.control }
                name="tipo"
                render={ ( { field } ) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel>Tipo de proceso</FormLabel>
                    <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                      <FormControl className="w-full">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="Estratégico" value="Estratégico">Estratégico</SelectItem>
                        <SelectItem key="Misional" value="Misional">Misional</SelectItem>
                        <SelectItem key="Soporte" value="Soporte">Soporte</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <div className="grid grid-cols-3 gap-4 m-0 w-full">
                <FormField
                  control={ form.control }
                  name="codigo"
                  render={ ( { field } ) => (
                    <FormItem className="mb-4 col-span-2 w-full">
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="Código del proceso" { ...field } className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name="nivel"
                  render={ ( { field } ) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel>Nivel de proceso</FormLabel>
                      <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                        <FormControl className="w-full">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key="nivel-0" value="0">0</SelectItem>
                          <SelectItem key="nivel-1" value="1">1</SelectItem>
                          <SelectItem key="nivel-2" value="2">2</SelectItem>
                          <SelectItem key="nivel-3" value="3">3</SelectItem>
                          <SelectItem key="nivel-4" value="4">4</SelectItem>
                          <SelectItem key="nivel-5" value="5">5</SelectItem>
                          <SelectItem key="nivel-6" value="6">6</SelectItem>
                          <SelectItem key="nivel-7" value="7">7</SelectItem>
                          <SelectItem key="nivel-8" value="8">8</SelectItem>
                          <SelectItem key="nivel-9" value="9">9</SelectItem>
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
                  <FormItem className="mb-4 w-full">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del proceso" { ...field } className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="descripcion"
                render={ ( { field } ) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input placeholder="Descripción del proceso" { ...field } className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="parentId"
                render={ ( { field } ) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel>Proceso padre (opcional)</FormLabel>
                    <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                      <FormControl className="w-full">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full max-w-[500px]">
                        {
                          listadoProcesos && listadoProcesos.length > 0 &&
                          [ ...listadoProcesos ]
                            .sort( ( a, b ) => a.codigo.localeCompare( b.codigo ) )
                            .map( proceso => (
                              <SelectItem
                                key={ `proceso-${proceso.id}` }
                                value={ proceso.id.toString() }
                                className="break-words truncate max-w-[480px]"
                              >
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
              <Button type="submit" className="flex justify-self-end w-full">
                { ( proceso && proceso.id ) ? "Actualizar Proceso" : "Registrar Proceso" }
              </Button>
            </form>
          </Form>
        </div>

      </DialogContent>
    </Dialog>

  );
};