import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { IoIosAddCircleOutline } from "react-icons/io";
import { fetchConToken } from "@/helpers/fetch";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";


// Suponiendo que tienes un formulario OwnerForm similar a MapaFormRegistro
import OwnerFormRegister from "./OwnerFormRegister";
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { BotonRegresar } from '@/components/propios/BotonRegresar';
import { Card } from '@/components/ui/card';


export const OwnersConfig = () => {
  const [ owners, setOwners ] = useState( [] );
  const [ open, setOpen ] = useState( false );
  const [ editOwner, setEditOwner ] = useState( null );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( "" );

  // Cargar owners al montar
  useEffect( () => {
    const cargarOwners = async () => {
      setLoading( true );
      const respuesta = await fetchConToken( "owners" );
      setOwners( respuesta.owners || [] );
      setLoading( false );
    };
    cargarOwners();
    setError( "" );
  }, [] );

  // Crear o editar owner
  const handleSubmit = async ( data ) => {
    try {
      let respuesta;
      if ( editOwner ) {
        respuesta = await fetchConToken( `owners/actualizar/${ editOwner.id }`, data, "PUT" );
      } else {
        respuesta = await fetchConToken( "owners/registrar", data, "POST" );
        console.log( { respuesta } );
      }
      if ( respuesta.ok ) {
        setOpen( false );
        setError( "" );
        setEditOwner( null );
        // Recargar lista
        const nuevaLista = await fetchConToken( "owners" );
        setOwners( nuevaLista.owners || [] );
      } else {
        setError( respuesta.msg || "Error al guardar owner" );
      }
    } catch ( error ) {
      console.log( error );
      setError( "Error de red" );
    }
  };

  // Eliminar owner
  const eliminarOwner = async ( owner ) => {
    if ( !window.confirm( "¿Seguro que deseas eliminar este owner?" ) ) return;
    const respuesta = await fetchConToken( `owners/eliminar/${ owner.id }`, {}, "PUT" );
    if ( respuesta.ok ) {
      setOwners( owners.filter( o => o.id !== owner.id ) );
    } else {
      setError( respuesta.msg || "Error al eliminar owner" );
    }
  };

  return (
    <div className="flex flex-col  w-full justify-center items-center shadow-lg p-5">
       <BotonRegresar url="/config" nombre="Configuración" />
      <h1 className="text-xl font-bold text-center">Configuración de Owners</h1>
      <div className="flex justify-end mb-4">
        <Dialog open={ open } onOpenChange={ ( value ) => {
          setOpen( value );
          if ( !value ) {
            setError( "" );
            setEditOwner( null );
          }
        } }>
          <DialogTrigger asChild>
            <Button className="mt-2" onClick={ () => { setOpen( true ); setEditOwner( null ); } }>
              <IoIosAddCircleOutline />
              Nuevo owner
            </Button>
          </DialogTrigger>
          <DialogContent  >
            <DialogHeader>
              <DialogTitle>{ editOwner ? "Editar Owner" : "Nuevo Owner" }</DialogTitle>
              { error && <span className="text-red-500">{ `Error: ${ error }` }</span> }
            </DialogHeader>
            <DialogDescription>
              Completa los campos para registrar un owner.
            </DialogDescription>
            <OwnerFormRegister
              onSubmit={ handleSubmit }
              initialValues={ editOwner }
            />
            <DialogFooter>
              <Button onClick={ () => { setOpen( false ), setError( "" ); } }>Cancelar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-2 w-full  p-5">
        { loading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : owners.length > 0 ? (
          <Table  className=" rounded-5 bg-white rounded-lg overflow-hidden border border-gray-400">
            <TableHeader>
              <TableRow >
                <TableHead className="border-r border-gray-300 ">#</TableHead>
                <TableHead className="border-r border-gray-300 ">Oficina</TableHead>
                <TableHead className="border-r border-gray-300 ">Siglas</TableHead>
                <TableHead className="border-r border-gray-300 ">Director</TableHead>
                <TableHead className="border-r border-gray-300 ">Correo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { owners.map( ( owner, index ) => (
                <TableRow key={ owner.id }  className="hover:bg-gray-200">
                  <TableCell>{ index + 1 }</TableCell>
                  <TableCell  className="whitespace-normal break-words">{ owner.oficina }</TableCell>
                  <TableCell>{ owner.siglas }</TableCell>
                  <TableCell className="whitespace-normal break-words">{ owner.director }</TableCell>
                  <TableCell>{ owner.correo }</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button variant="" onClick={ () => { setEditOwner( owner ); setOpen( true ); } }>
                        <CiEdit />
                      </Button>
                      <Button variant="destructive" onClick={ () => eliminarOwner( owner ) }>
                        <MdOutlineDeleteForever />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) ) }
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-gray-500">No hay owners registrados</div>
        ) }
      </div>
    </div>
  );
};