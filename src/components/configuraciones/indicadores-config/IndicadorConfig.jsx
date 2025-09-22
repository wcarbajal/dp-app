import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MathfieldElement } from "mathlive";
import { modificarIndicadorSchema } from '@/schema/InidicadorSchema';
import { Link, useNavigate, useParams } from 'react-router';
import { fetchConToken } from '@/helpers/fetch';
import Swal from 'sweetalert2';
import { ArrowBackUp } from 'tabler-icons-react';
import { capitalize } from '@/utils/text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function IndicadorConfig(  ) {

  const [ indicador, setIndicador ] = useState( null );
  
  const { id } = useParams();

  const navigate = useNavigate();

  const cargarIndicador = useCallback( async () => {
    const resultado = await fetchConToken( `indicador/unico/${ id }` );

    if ( resultado.ok ) {
      setIndicador( resultado.indicador );

    } else {
      setIndicador( null );
    }
  }, [ id ] );

  useEffect( () => {
    cargarIndicador();
  }, [ cargarIndicador ] );


  const mathFieldRef = useRef( null );


  // Para guardar el valor de la fórmula
  const handleFormulaChange = ( evt ) => {
    const latex = evt.target.value; // LaTeX string   

    form.setValue( "formula", latex );
  };

  const form = useForm( {
    resolver: zodResolver( modificarIndicadorSchema ),
    defaultValues: {
      codigo: indicador?.codigo || "",
      nombre: indicador?.nombre || "",
      nivelIndicador: indicador?.nivelIndicador || "OEI",
      tipoIndicador: indicador?.tipoIndicador || "IR",
      estado: indicador?.estado ?? true,
      justificacion: indicador?.justificacion || "",
      formula: indicador?.formula || "",
      sentidoEsperado: indicador?.sentidoEsperado || "",
      unidadMedida: indicador?.unidadMedida || "",
      frecuencia: indicador?.frecuencia || "",
      fuenteDatos: indicador?.fuenteDatos || "",
      logrosEsperados: indicador?.logrosEsperados || "",
      lineaBase: indicador?.lineaBase || "",
    }
  } );

  //const [ resultados, setResultados ] = useState( indicador.resultados );

  //const [ editIdx, setEditIdx ] = useState( null );
  //const [ mensaje, setMensaje ] = useState( "" );
  //const [ formErrors, setFormErrors ] = useState( {} );


  // Indicador
  /*  const handleChange = ( field, value  ) => {
     setForm({ ...form, [field]: value });
     setMensaje( "" );
   }; */



  // Guardar Indicador
  const handleSubmit = async ( values ) => {

    const respuesta = await fetchConToken( `indicador/${ id }`, values, "PUT" );
    if ( respuesta.ok ) {

      // 'Éxito', 'Indicador creado correctamente', 'success'
      Swal.fire( {
        title: 'Confirmación de actualización',
        text: "El indicador ha sido actualizado correctamente.",
        icon: 'success',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        }
      } );
      form.reset( values );
      
    } else {

      await Swal.fire( {
        title: `Error: ${ respuesta.msg || 'No se pudo actualizar el indicador' }`,
        text: "Ha ocurrido un error al actualizar el indicador.",
        icon: 'error',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Regresar',
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 z-10',
        }
      } );


    }
  };


  useEffect( () => {
    if ( indicador ) {
      form.reset( {
        codigo: indicador.codigo,
        nombre: indicador.nombre,
        nivelIndicador: indicador?.nivelIndicador || "",
        tipoIndicador: indicador?.tipoIndicador || "",
        estado: indicador.estado,
        justificacion: indicador.justificacion || "",
        formula: indicador.formula || "",
        sentidoEsperado: indicador.sentidoEsperado || "",
        unidadMedida: indicador.unidadMedida || "",
        frecuencia: indicador.frecuencia || "",
        fuenteDatos: indicador.fuenteDatos || "",
        logrosEsperados: indicador.logrosEsperados || "",
        lineaBase: indicador.lineaBase || "",
      } );
    }
  }, [ indicador, form ] );

  const handleDelete = async () => {

    const result = await Swal.fire( {
      title: '¿Estás seguro?',
      text: "No podrás deshacer esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false, // <--- Esto es clave
      customClass: {
        confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 z-10 px-4 py-2 rounded mr-2 rounded-lg', // azul
        cancelButton: 'bg-red-600 text-white shadow-xs hover:bg-red-700 z-10 px-4 py-2 rounded-lg', // rojo
      }
    } );

    if ( result.isConfirmed ) {

      const respuesta = await fetchConToken( `indicador/${ id }`, {}, 'DELETE' );

      if ( respuesta.ok ) {

        await Swal.fire( {
          title: 'Eliminaciòn exitosa',
          text: "Indicador eliminado correctamente",
          icon: 'success',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false, // <--- Esto es clave
          customClass: {
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 z-10 px-4 py-2 rounded mr-2 rounded-lg',
          }
        } );
        
        navigate( '/config/indicadores' );
      } else {
        Swal.fire( {
          title: 'Error en la eliminación',
          text: "Indicador no se pudo borrar: " + ( respuesta.msg || '' ),
          icon: 'error',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false, // <--- Esto es clave
          customClass: {
            confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 z-10 px-4 py-2 rounded mr-2 rounded-lg',
          }
        } );

      }
    }
  };

  //mmuestrame los todos los errores del formulario



  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto mt-8"
      style={ { minHeight: "90vh", paddingBottom: "200px" } }
    >
      <Card>
        <CardHeader>
          <CardTitle>Editar Indicador</CardTitle>
        </CardHeader>
        <CardContent>
          <Form { ...form }>
            <form onSubmit={ form.handleSubmit( handleSubmit ) } className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={ form.control }
                  name="codigo"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input { ...field } />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name="nombre"

                  render={ ( { field } ) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input { ...field } />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={ form.control }
                  name="nivelIndicador"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Tipo de Nivel</FormLabel>
                      <Select
                        value={ field.value }
                        onValueChange={ field.onChange }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona el tipo de nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OEI">OEI - Objetivo Estratégico Institucional</SelectItem>
                          <SelectItem value="AEI">AEI - Objetivo Estratégico de Aprendizaje</SelectItem>
                          <SelectItem value="PE">PE - Producto Estratégico</SelectItem>
                          <SelectItem value="AO">AO - Actividad Operativa</SelectItem>
                          <SelectItem value="IG">IG - Indicador de gestión</SelectItem>
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
                      <FormLabel>Tipo de Indicador</FormLabel>
                      <Select
                        value={ field.value }
                        onValueChange={ field.onChange }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona el tipo de indicador" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IR">IR - Indicador de Resultado</SelectItem>
                          <SelectItem value="IP">IP - Indicador de Producto</SelectItem>
                          <SelectItem value="IA">IA - Indicador de Actividad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
              </div>
              <FormField
                control={ form.control }
                name="formula"
                render={ ( { field } ) => (
                  <FormItem>
                    <FormLabel>Fórmula</FormLabel>
                    <FormControl>
                      <math-field
                        ref={ mathFieldRef }
                        value={ field.value }
                        onInput={ handleFormulaChange }
                        virtual-keyboard-mode="onfocus"
                        virtual-keyboard-theme="material"
                        virtual-keyboard-placement="right"
                        style={ { width: "100%", minHeight: "40px", border: "1px solid #ccc", borderRadius: "6px", padding: "8px" } }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <FormField
                control={ form.control }
                name="justificacion"
                render={ ( { field } ) => (
                  <FormItem>
                    <FormLabel>Justificación</FormLabel>
                    <FormControl>
                      <Input { ...field } />
                    </FormControl>
                  </FormItem>
                ) }
              />

              <div className="grid grid-cols-2 gap-4">

                <FormField
                  control={ form.control }
                  name="unidadMedida"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Unidad de Medida</FormLabel>
                      <FormControl>
                        <Input { ...field }
                          value={ capitalize( field.value ) || "" }
                          onChange={ e => field.onChange( capitalize( e.target.value ) ) }
                        />
                      </FormControl>
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name="frecuencia"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Frecuencia</FormLabel>
                      <FormControl>
                        <Input { ...field } />
                      </FormControl>
                    </FormItem>
                  ) }
                />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={ form.control }
                  name="fuenteDatos"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Fuente de Datos</FormLabel>
                      <FormControl>
                        <Input { ...field } />
                      </FormControl>
                    </FormItem>
                  ) }
                />
                <FormField
                  control={ form.control }
                  name="logrosEsperados"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Logros Esperados</FormLabel>
                      <FormControl>
                        <Input { ...field } />
                      </FormControl>
                    </FormItem>
                  ) }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={ form.control }
                  name="lineaBase"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Línea Base</FormLabel>
                      <FormControl>
                        <Input { ...field } />
                      </FormControl>
                    </FormItem>
                  ) }
                />

                <FormField
                  control={ form.control }
                  name="sentidoEsperado"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Sentido Esperado</FormLabel>
                      <Select
                        value={ field.value || "" }
                        onValueChange={ field.onChange }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona el sentido" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ascendente">Ascendente</SelectItem>
                          <SelectItem value="Descendente">Descendente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  ) }
                />
              </div>
              { Object.keys( form.formState.errors ).length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm space-y-1">
                  { Object.entries( form.formState.errors ).map( ( [ key, error ] ) => (
                    <div key={ key }>
                      { error.message }
                    </div>
                  ) ) }
                </div>
              ) }
              <div className="flex justify-center gap-2 ">
                <Button type="button" variant="outline">
                  <Link to="/config/indicadores" className="flex gap-2">
                    <ArrowBackUp size={ 24 } />
                    Regresar
                  </Link>
                </Button>
                <Button type="submit" disabled={ !form.formState.isDirty }>Actualizar</Button>
                <Button variant="destructive" type="button" onClick={ handleDelete }>Eliminar</Button>
              </div>


            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Resultados */ }
      {/*  <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resultados del Indicador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={ handleResultadoSubmit } className="space-y-4">
            <div>
              <Label>Denominación</Label>
              <Input
                value={ resultadoForm.denominacion }
                onChange={ e => handleResultadoChange( "denominacion", e.target.value ) }
              />
              { resultadoErrors.denominacion && (
                <span className="text-red-500 text-xs">{ resultadoErrors.denominacion }</span>
              ) }
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                value={ resultadoForm.descripcion }
                onChange={ e => handleResultadoChange( "descripcion", e.target.value ) }
              />
              { resultadoErrors.descripcion && (
                <span className="text-red-500 text-xs">{ resultadoErrors.descripcion }</span>
              ) }
            </div>
            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                value={ resultadoForm.valor }
                onChange={ e => handleResultadoChange( "valor", e.target.value ) }
                className={ resultadoErrors.valor ? "border-red-500" : "" }
              />
              { resultadoErrors.valor && (
                <span className="text-red-500 text-xs">{ resultadoErrors.valor }</span>
              ) }
            </div>
            <div>
              <Label>Fecha de Registro</Label>
              <Input
                type="date"
                value={ resultadoForm.fechaRegistro }
                onChange={ e => handleResultadoChange( "fechaRegistro", e.target.value ) }
                className={ resultadoErrors.fechaRegistro ? "border-red-500" : "" }
              />
              { resultadoErrors.fechaRegistro && (
                <span className="text-red-500 text-xs">{ resultadoErrors.fechaRegistro }</span>
              ) }
            </div>
            <Button type="submit">{ editIdx !== null ? "Actualizar Resultado" : "Agregar Resultado" }</Button>
          </form>

          // Lista de resultados 
          <div className="mt-6">
            { resultados.length === 0 && (
              <div className="text-muted-foreground text-sm">No hay resultados registrados</div>
            ) }
            { resultados.map( ( res, idx ) => (
              <Card key={ res.id } className="mb-2">
                <CardContent className="flex flex-col gap-2">
                  <div><b>Denominación:</b> { res.denominacion }</div>
                  <div><b>Descripción:</b> { res.descripcion }</div>
                  <div><b>Valor:</b> { res.valor }</div>
                  <div><b>Fecha:</b> { res.fechaRegistro }</div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={ () => handleEditResultado( idx ) }>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={ () => handleDeleteResultado( idx ) }>Eliminar</Button>
                  </div>
                </CardContent>
              </Card>
            ) ) }
          </div>
        </CardContent>
      </Card>  */}
    </div>
  );
}