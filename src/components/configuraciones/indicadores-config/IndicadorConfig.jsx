import { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MathfieldElement } from "mathlive";

// Datos de muestra basados en el modelo Prisma
const indicadorDemo = {
  id: 1,
  codigo: "OEI.01",
  nombre: "Mejorar la calidad educativa",
  tipoNivel: "OEI",
  estado: true,
  creadoEn: new Date( "2024-01-01" ),
  actualizadoEn: new Date( "2024-06-01" ),
  justificacion: "Justificación ejemplo",
  formula: "Fórmula ejemplo",
  sentidoEsperado: "Ascendente",
  unidadMedida: "Porcentaje",
  frecuencia: "Mensual",
  fuenteDatos: "SIE",
  logrosEsperados: "80%",
  lineaBase: "60%",
  parentId: null,
  procesoId: 1,
  resultados: [
    {
      id: 1,
      denominacion: "Resultado 1",
      descripcion: "Primer resultado",
      valor: 75.5,
      fechaRegistro: "2024-06-01",
    },
    {
      id: 2,
      denominacion: "Resultado 2",
      descripcion: "Segundo resultado",
      valor: 80.0,
      fechaRegistro: "2024-06-10",
    },
  ],
};

// Zod schema para validación de Indicador
const indicadorSchema = z.object( {
  codigo: z.string().min( 1, "El código es obligatorio" ),
  nombre: z.string().min( 1, "El nombre es obligatorio" ),
  tipoNivel: z.enum( [ "OEI", "AEI", "IO" ] ),
  estado: z.boolean(),
  justificacion: z.string().optional(),
  formula: z.string().optional(),
  sentidoEsperado: z.string().optional(),
  unidadMedida: z.string().optional(),
  frecuencia: z.string().optional(),
  fuenteDatos: z.string().optional(),
  logrosEsperados: z.string().optional(),
  lineaBase: z.string().optional(),
} );


// Zod schema para validación de Resultado
const resultadoSchema = z.object( {
  denominacion: z.string().optional(),
  descripcion: z.string().optional(),
  valor: z.coerce.number().min( 0, "Debe ser un número positivo" ),
  fechaRegistro: z.string().min( 1, "La fecha es obligatoria" ),
} );

export function IndicadorConfig() {

  const mathFieldRef = useRef( null );


  // Para guardar el valor de la fórmula
  const handleFormulaChange = ( evt ) => {
    const latex = evt.target.value; // LaTeX string
    console.log( "Fórmula en LaTeX:", latex );
    form.setValue( "formula", latex );
  };

  const form = useForm( {
    resolver: zodResolver( indicadorSchema ),
    defaultValues: {
      codigo: indicadorDemo.codigo,
      nombre: indicadorDemo.nombre,
      tipoNivel: indicadorDemo.tipoNivel,
      estado: indicadorDemo.estado,
      justificacion: indicadorDemo.justificacion || "",
      formula: indicadorDemo.formula || "",
      sentidoEsperado: indicadorDemo.sentidoEsperado || "",
      unidadMedida: indicadorDemo.unidadMedida || "",
      frecuencia: indicadorDemo.frecuencia || "",
      fuenteDatos: indicadorDemo.fuenteDatos || "",
      logrosEsperados: indicadorDemo.logrosEsperados || "",
      lineaBase: indicadorDemo.lineaBase || "",
    }
  } );

  const [ resultados, setResultados ] = useState( indicadorDemo.resultados );
  const [ resultadoForm, setResultadoForm ] = useState( {
    denominacion: "",
    descripcion: "",
    valor: "",
    fechaRegistro: "",
  } );
  const [ editIdx, setEditIdx ] = useState( null );
  const [ mensaje, setMensaje ] = useState( "" );
  //const [ formErrors, setFormErrors ] = useState( {} );
  const [ resultadoErrors, setResultadoErrors ] = useState( {} );

  // Indicador
  /*  const handleChange = ( field, value  ) => {
     setForm({ ...form, [field]: value });
     setMensaje( "" );
   }; */

  // Resultado
  const handleResultadoChange = ( field, value ) => {
    setResultadoForm( { ...resultadoForm, [ field ]: value } );
  };

  // Guardar Indicador
  const handleSubmit = ( e ) => {
    e.preventDefault();
    const result = indicadorSchema.safeParse( form );
    if ( !result.success ) {
      const zodErrors = {};
      result.error.errors.forEach( ( err ) => {
        zodErrors[ err.path[ 0 ] ] = err.message;
      } );
      //setFormErrors( zodErrors );
      return;
    }
    //setFormErrors( {} );
    setMensaje( "Indicador actualizado correctamente" );
  };

  // Guardar o editar Resultado
  const handleResultadoSubmit = ( e ) => {
    e.preventDefault();
    const result = resultadoSchema.safeParse( resultadoForm );
    if ( !result.success ) {
      const zodErrors = {};
      result.error.errors.forEach( ( err ) => {
        zodErrors[ err.path[ 0 ] ] = err.message;
      } );
      setResultadoErrors( zodErrors );
      return;
    }
    setResultadoErrors( {} );
    if ( editIdx !== null ) {
      // Editar resultado existente
      const nuevos = [ ...resultados ];
      nuevos[ editIdx ] = {
        ...nuevos[ editIdx ],
        ...resultadoForm,
        valor: Number( resultadoForm.valor ),
        fechaRegistro: resultadoForm.fechaRegistro,
      };
      setResultados( nuevos );
      setEditIdx( null );
    } else {
      // Agregar nuevo resultado
      setResultados( [
        ...resultados,
        {
          id: resultados.length + 1,
          ...resultadoForm,
          valor: Number( resultadoForm.valor ),
          fechaRegistro: resultadoForm.fechaRegistro,
        },
      ] );
    }
    setResultadoForm( {
      denominacion: "",
      descripcion: "",
      valor: "",
      fechaRegistro: "",
    } );
  };

  // Editar resultado
  const handleEditResultado = ( idx ) => {
    setResultadoForm( {
      denominacion: resultados[ idx ].denominacion || "",
      descripcion: resultados[ idx ].descripcion || "",
      valor: resultados[ idx ].valor,
      fechaRegistro: resultados[ idx ].fechaRegistro
        ? resultados[ idx ].fechaRegistro
        : "",
    } );
    setEditIdx( idx );
  };

  // Eliminar resultado
  const handleDeleteResultado = ( idx ) => {
    setResultados( resultados.filter( ( _, i ) => i !== idx ) );
    setEditIdx( null );
    setResultadoForm( {
      denominacion: "",
      descripcion: "",
      valor: "",
      fechaRegistro: "",
    } );
  };

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
                  name="tipoNivel"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Tipo de Nivel</FormLabel>
                      <FormControl>
                        <select { ...field } className="w-full border rounded p-2">
                          <option value="OEI">OEI</option>
                          <option value="AEI">AEI</option>
                          <option value="IO">IO</option>
                        </select>
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
               {/*  <FormField
                  control={ form.control }
                  name="estado"
                  render={ ( { field } ) => (
                    <FormItem className="flex items-center justify-around mt-6">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={ field.value }
                          onChange={ field.onChange }
                          className="ml-2"
                        />
                      </FormControl>
                    </FormItem>
                  ) }
                /> */}

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

              <div className="grid grid-cols-2 gap-4">

                <FormField
                  control={ form.control }
                  name="unidadMedida"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Unidad de Medida</FormLabel>
                      <FormControl>
                        <Input { ...field } />
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
                      <FormControl>
                        <Input { ...field } />
                      </FormControl>
                    </FormItem>
                  ) }
                />
              </div>

              <Button type="submit">Actualizar</Button>
              { mensaje && <div className="text-green-600 text-sm mt-2">{ mensaje }</div> }
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Resultados */ }
         <Card className="mt-8">
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
      </Card> 
    </div>
  );
}