import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Swal from "sweetalert2";
import { Card } from '@/components/ui/card';

// Datos de prueba
const indicadoresPrueba = [
  {
    id: 1,
    codigo: "OEI.1",
    nombre: "Indicador Estratégico 1",
    nivelIndicador: "OEI",
    tipoIndicador: "IR",
    estado: true,
    sentidoEsperado: "Ascendente",
    mapaId: 1,
  },
  {
    id: 2,
    codigo: "AEI.2",
    nombre: "Indicador de Aprendizaje",
    nivelIndicador: "AEI",
    tipoIndicador: "IP",
    estado: true,
    sentidoEsperado: "Descendente",
    mapaId: 1,
  },
  {
    id: 3,
    codigo: "IG.3",
    nombre: "Indicador de Gestión",
    nivelIndicador: "IG",
    tipoIndicador: "IA",
    estado: true,
    sentidoEsperado: "Ascendente",
    mapaId: 1,
  },
];

// Zod schema para validación (un solo indicador)
const schema = z.object( {
  indicador: z.string().min( 1, "Debes seleccionar un indicador" ),
} );

export const IndicadoresProceso = () => {
  const [ indicadores ] = useState( indicadoresPrueba );

  const form = useForm( {
    resolver: zodResolver( schema ),
    defaultValues: {
      indicador: "",
    },
  } );

  const onSubmit = ( data ) => {
    const seleccionado = indicadores.find( ( i ) => String( i.id ) === data.indicador );
    Swal.fire( {
      title: "Indicador asignado",
      html: `<pre>${ JSON.stringify( seleccionado, null, 2 ) }</pre>`,
      icon: "success",
    } );
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Asignar indicador al proceso</h2>
      <Card className="mb-4 p-5">
        <Form { ...form }>
          <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-6">
            <FormField
              control={ form.control }
              name="indicador"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Indicadores disponibles</FormLabel>
                  <FormControl>
                    <Select
                      value={ field.value }
                      onValueChange={ field.onChange }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un indicador" />
                      </SelectTrigger>
                      <SelectContent>
                        { indicadores.map( ( indicador ) => (
                          <SelectItem key={ indicador.id } value={ String( indicador.id ) }>
                            { indicador.codigo } - { indicador.nombre } ({ indicador.nivelIndicador })
                          </SelectItem>
                        ) ) }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) }
            />
            <Button type="submit" className="w-full">
              Asignar indicador
            </Button>
          </form>
        </Form>
      </Card>
      <Card className="p-5">
        <h3 className="text-lg font-bold mb-4">Indicadores asignados</h3>
        <p className="text-gray-500">Aquí se mostrarán los indicadores asignados al proceso.</p>
      </Card>

    </div>
  );
};