import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapaSchema } from '@/schema/MapaSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { fetchConToken } from '@/helpers/fetch';
import { MapasLista } from './MapasLista';
import { MapaFormRegistro } from './MapaFormRegistro';
import { IoIosAddCircleOutline } from "react-icons/io";
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import { BotonRegresar } from '@/components/propios/BotonRegresar';


export const MapaConfig = () => {

  const [ open, setOpen ] = useState( false );
  const [ loading, setLoading ] = useState( true );
  const [ mapas, setMapas ] = useState( undefined );
  const [ error, setError ] = useState( null );

  const form = useForm( {
    resolver: zodResolver( MapaSchema ),
    defaultValues: {
      ruc: "",
      nombre: "",
      descripcion: "",
      entrada: "",
      salida: ""
    },
  } );
  const cargarMapas = async () => {
    try {
      const respuesta = await fetchConToken( "mapa" );


      if ( respuesta.ok === false ) {
        setLoading( false );
        return;
      }
      setMapas( respuesta.mapas );
      setLoading( false );
      setError( null );
    } catch ( error ) {
      console.error( "Error al cargar procesos:", error );
    }
  };
  useEffect( () => {

    if ( open === false ) {
      setError( null );

    }
  }, [ open ] );


  useEffect( () => {

    cargarMapas();

  }, [] );

  const onSubmit = async ( values ) => {

    const mapaRegistrada = await fetchConToken( "mapa/registrar", values, "POST" );

    if ( mapaRegistrada.ok === false ) {

      setError( mapaRegistrada.msg );
      return;
    }
    setError( null );
    setOpen( false );
    Swal.fire( {
      title: 'Registro exitoso al registrar el mapa',
      text: mapaRegistrada.msg,
      icon: 'success',
      iconColor: '#2E2E2E', // azul tailwind-500
      confirmButtonColor: '#2A2A2A', // azul tailwind-500
      customClass: {
        popup: 'z-[100]',
        confirmButton: 'z-index-1000 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
      },
    } );


    await cargarMapas();
  };


  return (
    <div className="flex flex-col gap-5 w-full shadow-lg ">
      <BotonRegresar url="/config" nombre="Configuración" />
      
      <h1 className="text-xl font-bold text-center ">Mapa de Procesos del PRONABEC</h1>
      { loading
        ? ( <div className="text-center text-gray-500">Cargando...</div> )
        :
        (
          <div className=" w-[89vw]">
            <div className="flex justify-end mb-4">
              <Dialog open={ open } onOpenChange={ setOpen } className="">
                <DialogTrigger asChild className="z-2">
                  <Button className="mt-2" onClick={ () => setOpen( true ) }>
                    <IoIosAddCircleOutline />
                    Nuevo mapa
                  </Button>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>Nuevo Mapa</DialogTitle>
                    { error && ( <span className="text-red-500">{ `Error: ${ error }` }</span> ) }
                  </DialogHeader>
                  <DialogDescription>
                    Completa los campos para registrar un nuevo mapa de procesos.
                  </DialogDescription>
                  <MapaFormRegistro onSubmit={ onSubmit } form={ form } />

                </DialogContent>
                <DialogFooter>

                </DialogFooter>
              </Dialog>
            </div>
            <div className="w-">
              {
                mapas && mapas.length > 0 ? (
                  <MapasLista mapas={ mapas } cargarMapas={ cargarMapas } />
                ) : (
                  <div className="text-center text-gray-500">No hay mapas registrados</div>
                )
              }

            </div>
          </div>
        )

      }
    </div>

  );
};