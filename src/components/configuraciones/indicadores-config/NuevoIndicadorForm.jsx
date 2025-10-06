import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { nuevoIndicadorSchema } from '@/schema/InidicadorSchema';
import { useEffect, useState } from 'react';
import { fetchConToken } from '@/helpers/fetch';
import { Plus } from 'tabler-icons-react';
import Swal from 'sweetalert2';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export const NuevoIndicadorForm = ( { mapaId, indicadoresList, obtenerIndicadores } ) => {

  const [ open, setOpen ] = useState( false );

  const form = useForm( {
    resolver: zodResolver( nuevoIndicadorSchema ),
    defaultValues: {
      codigo: "",
      nombre: "",
      nivelIndicador: "",
      codigoSufijo: "",
      tipoNivel: "",
      parentId: "",
      mapaId: mapaId || null,
    },
  } );

  // Escucha cambios en nivelIndicador y actualiza el código
  const nivelIndicador = form.watch( "nivelIndicador" );
  // Nuevo campo para la parte editable del código
  const codigoSufijo = form.watch( "codigoSufijo" ) || "";


  // Cuando cambia tipoNivel, actualiza el código automáticamente
  // Puedes personalizar la lógica para construir el código aquí
  // Actualiza el valor de "codigo" cada vez que cambia tipoNivel o codigoSufijo
  useEffect( () => {
    if ( nivelIndicador ) {
      form.setValue( "codigo", `${ nivelIndicador }.${ codigoSufijo }` );
    } else {
      form.setValue( "codigo", "" );
    }
  }, [ nivelIndicador, codigoSufijo, form ] );


  const onSubmit = async ( data ) => {

       const respuesta = await fetchConToken( `indicador/${ mapaId }`, data, 'POST' );
    if ( respuesta.ok ) {
      form.reset();

      setOpen( false );
      // 'Éxito', 'Indicador creado correctamente', 'success'
          Swal.fire( {
        title: 'Confirmación de creación',
        text: "El indicador ha sido creado correctamente.",
        icon: 'success',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        }
      } );
      obtenerIndicadores();
      form.reset();
    } else {
      setOpen( false );
      await Swal.fire( {
        title: `Error: ${ respuesta.msg || 'No se pudo crear el indicador' }`,
        text: "Ha ocurrido un error al crear el indicador.",
        icon: 'error',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Regresar',
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 z-10',
        }
      } );
      setOpen( true );

    }
    
  };

  return (
    <Dialog open={ open } onOpenChange={ setOpen }>
      <DialogTrigger className="fixed bottom-10 right-8 z-50 rounded-full w-14 h-14 hover:flex hover:items-center  hover:justify-between bg-black/70 hover:bg-black hover:w-46 transition-all duration-300 group overflow-hidden ">

        <Plus strokeWidth={ 3 } size={ 50 } className="text-white h-8" />
        <span className=" absolute left-12 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-base font-semibold whitespace-nowrap">
          Agregar indicador
        </span>
      </DialogTrigger>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Registrar nuevo indicador</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo indicador.
          </DialogDescription>
          <Form { ...form }>
            <form
              onSubmit={ form.handleSubmit( onSubmit ) }
              className="space-y-3 mt-4 "
            >
              
                <FormField
                  control={ form.control }
                  name="nivelIndicador"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Nivel Indicador</FormLabel>
                      <Select
                        value={ field.value || "" }
                        onValueChange={ field.onChange }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona el nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <SelectItem key="OEI" value="OEI">OEI - Objetivo Estratégico Institucional</SelectItem>
                          <SelectItem key="AEI" value="AEI">AEI - Objetivo Estratégico de Aprendizaje</SelectItem>
                          <SelectItem key="IO" value="IO">IO - Indicador de Resultado</SelectItem>
                          <SelectItem key="PE" value="PE">PE - Producto Esperado</SelectItem>
                          <SelectItem key="AO" value="AO">AO - Actividad Operativa</SelectItem>
                          <SelectItem key="IG" value="IG">IG - Indicador de Gestión</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name="tipoIndicador"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Tipo Indicador</FormLabel>
                      <Select
                        value={ field.value || "" }
                        onValueChange={ field.onChange }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona el nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <SelectItem key="IR" value="IR">IR - Indicador de Resultado</SelectItem>
                          <SelectItem key="IP" value="IP">IP - Indicador de Proceso</SelectItem>
                          <SelectItem key="IA" value="IA">IA - Indicador de Actividad</SelectItem>

                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                <FormField
                  control={ form.control }
                  name="codigoSufijo"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Correlativo de indicador</FormLabel>
                      <FormControl>
                        <Input type='number' value={field.value ?? 1} min={ 1 } { ...field } autoFocus placeholder="Ingrese el sufijo del código" />
                      </FormControl>
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
                      <Input { ...field } value={field.value ?? ""} readOnly />
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
                      <Input { ...field } value={field.value ?? ""}/>
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
                    <FormLabel>Selecciona un padre</FormLabel>
                    <Select
                      value={ field.value || "" }
                      onValueChange={ field.onChange }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sin padre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>

                        { indicadoresList && indicadoresList.map( indicador => (

                          <SelectItem key={ indicador.id } value={ String( indicador.id ) }>
                            { indicador.codigo } - { indicador.nombre }
                          </SelectItem>

                        ) ) }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              {/* Agrega aquí más campos según tu schema */ }
              <Button type="submit" className="w-full mt-2">
                Registrar
                
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog >
  );
};