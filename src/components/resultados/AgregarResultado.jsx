import { capitalize } from '@/utils/text';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import { Plus, CloudUpload, Refresh } from "tabler-icons-react";

export const AgregarResultado = ({indicador, accordionValue, setAccordionValue, editingResult, form, handleSave, loading, handleClearForm }) => {

 

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full mt-0 bg-white p-3 rounded-lg shadow"
      value={ accordionValue }
      onValueChange={ setAccordionValue }
    >
      <AccordionItem value="formulario-resultado" id="formulario-resultado">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Plus size={ 20 } />
            { editingResult ? "Editar Resultado" : "Nuevo Resultado" }
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex pt-4 ">
          <div className="flex flex-col w-6/8 px-10">
            <div className="text-sm text-muted-foreground mb-4 ">
              { editingResult
                ? "Modificar los datos del resultado seleccionado"
                : "Agregar un nuevo resultado para el indicador" }
            </div>

            <Form { ...form } className="w-full ">
              <form onSubmit={ form.handleSubmit( handleSave ) } className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  {/* Denominación */ }
                  <FormField
                    control={ form.control }
                    name="denominacion"
                    render={ ( { field } ) => (
                      <FormItem>
                        <FormLabel>Denominación</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese la denominación del resultado"
                            { ...field }
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre o título descriptivo (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    ) }
                  />

                  {/* Valor */ }
                  <FormField
                    control={ form.control }
                    name="valor"
                    render={ ( { field } ) => (
                      <FormItem>
                        <FormLabel>Valor *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            { ...field }
                          />
                        </FormControl>
                        <FormDescription>
                          Valor numérico del resultado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    ) }
                  />
                </div>

                {/* Fecha de registro */ }
                <FormField
                  control={ form.control }
                  name="fechaRegistro"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Fecha de Registro *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          { ...field }
                        />
                      </FormControl>
                      <FormDescription>
                        Fecha en la que se registra el resultado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                {/* Descripción */ }
                <FormField
                  control={ form.control }
                  name="descripcion"
                  render={ ( { field } ) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción detallada del resultado..."
                          className="min-h-[100px]"
                          { ...field }
                        />
                      </FormControl>
                      <FormDescription>
                        Descripción detallada (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  ) }
                />

                {/* Botones */ }
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                    disabled={ loading }
                  >
                    <CloudUpload size={ 16 } />
                    { loading ? "Guardando..." : ( editingResult ? "Actualizar" : "Guardar" ) } Resultado
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={ handleClearForm }
                    className="flex items-center gap-2"
                  >
                    <Refresh size={ 16 } />
                    Limpiar
                  </Button>
                </div>
              </form>
            </Form>



          </div>
          <Card className=" bg-white shadow-2xl border boder-1-gray-300 ">
            <CardHeader>
              <CardTitle className="font-bold text-center">Información del Indicador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-semibold">Código:</span> { indicador?.codigo }
              </div>
              <div>
                <span className="font-semibold">Nombre:</span> { indicador?.nombre }
              </div>
              <div>
                <span className="font-semibold">Descripción:</span> { indicador?.descripcion }
              </div>
              { indicador?.formula && (
                <div>
                  <span className="font-semibold">Fórmula:</span>
                  <math-field
                    read-only
                    value={ indicador.formula }
                    style={ {
                      display: 'inline-block',
                      marginLeft: '8px',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '16px'
                    } }
                  />
                </div>
              ) }
              <div>
                <span className="font-semibold">Frecuencia:</span> { indicador?.frecuencia }
              </div>
              <div>
                <span className="font-semibold">Unidad de medida:</span> { capitalize( indicador?.unidadMedida ) }
              </div>
              <div>
                <span className="font-semibold">Fuente de Datos:</span> { indicador?.fuenteDatos }
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};