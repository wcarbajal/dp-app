import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapaSchema } from '@/schema/MapaSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { fetchConToken } from '@/helpers/fetch';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MapasView } from './MapasView';
import { MapaForm } from './MapaForm';
export const MapaConfig = () => {

  const [ open, setOpen ] = useState( false );
  const [ loading, setLoading ] = useState( true );
  const [ mapa, setMapa ] = useState( [] );

  const form = useForm( {
    resolver: zodResolver( MapaSchema ),
    defaultValues: {
      ruc: "",
      nombre: "",
      entrada: "",
      salida: ""
    },
  } );


  useEffect( () => {

    const cargarMapas = async () => {
      try {
        const respuesta = await fetchConToken( "mapa" );
        console.log( "respuesta", respuesta );

        if ( respuesta.ok === false ) {
          setLoading( false );
          return;
        }
        setMapa( respuesta.mapa );
        setLoading( false );
      } catch ( error ) {
        console.error( "Error al cargar procesos:", error );
      }
    };
    cargarMapas();


  }, [] );

  const onSubmit = async ( values ) => {
    console.log( values );
    setOpen( false );
  };

  return (
    <div className="flex flex-col gap-5 w-full justify-center items-center shadow-lg">
      <h1 className="text-xl font-bold text-center ">Mapa de Procesos del PRONABEC</h1>
      { loading
        ? ( <div className="text-center text-gray-500">Cargando...</div> )
        : (
          mapa.length > 0 ? (
            <span>No hay mapa registrado</span>
          )
            : (
              <div>
                <div>
                  <Dialog open={ open } onOpenChange={ setOpen }>
                    <DialogTrigger asChild>
                      <Button className="mt-2" onClick={ () => setOpen( true ) }>
                        Registrar mapa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registrar Mapa</DialogTitle>
                      </DialogHeader>
                      <MapaForm onSubmit={ onSubmit } form={ form } />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-col gap-2">
                  <MapasView mapa={ mapa } />
                </div>
              </div>
            ) )
      }
    </div>

  );
};