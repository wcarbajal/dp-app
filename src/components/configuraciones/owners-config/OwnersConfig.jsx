import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { IoIosAddCircleOutline, IoIosClose, IoIosSearch } from "react-icons/io";
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
import { ListaMapas } from '@/components/ListaMapas';
import { cargarMapas } from '@/helpers/mapas';
import Swal from 'sweetalert2';
import { Input } from '@/components/ui/input';
import { Paginacion } from '@/components/paginacion/Paginacion';


export const OwnersConfig = () => {

  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );
  const [ owners, setOwners ] = useState( [] );
  const [ open, setOpen ] = useState( false );
  const [ editOwner, setEditOwner ] = useState( null );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState( "" );

  const [ filtro, setFiltro ] = useState( "" );

  const [ paginaActual, setPaginaActual ] = useState( 1 );
  const [ itemsPorPagina, setItemsPorPagina ] = useState( 10 );

  useEffect( () => {
    const obtenerMapas = async () => {
      setLoading( true );
      const mapas = await cargarMapas();
      setMapas( mapas );
      setLoading( false );
    };
    obtenerMapas();
  }, [ mapaSeleccionado ] );

  const cargarOwners = useCallback( async () => {

    if ( !mapaSeleccionado ) return;
    try {
      const respuesta = await fetchConToken( `owners/${ mapaSeleccionado.id }` );
      if ( respuesta.ok ) {
        setOwners( respuesta.owners );
      } else {
        setOwners( [] );
      }
    } catch ( error ) {
      setOwners( [] );
      console.error( "Error al cargar los dueños de proceso:", error );
    }
  }, [ mapaSeleccionado ] );

  // Cargar owners al montar
  useEffect( () => {
    cargarOwners();
  }, [ cargarOwners ] );

  // Crear o editar owner
  const handleSubmit = async ( data ) => {

    try {
      let respuesta;
      if ( editOwner ) {
        respuesta = await fetchConToken( `owners/actualizar/${ editOwner.id }`, data, "PUT" );
        

      } else {
        respuesta = await fetchConToken( "owners/registrar", data, "POST" );

      }
      if ( respuesta.ok ) {
        setOpen( false );
        setError( "" );
        setEditOwner( null );
        // Recargar lista
        const nuevaLista = await fetchConToken( `owners/${ mapaSeleccionado.id }` );
        setOwners( nuevaLista.owners || [] );
      } else {
        setError( respuesta.msg || "Error al cargar dueños de procesos" );
      }
    } catch ( error ) {
      console.log( error );
      setError( "Error de red" );
    }
  };

  // Eliminar owner
  const eliminarOwner = async ( owner ) => {

    const result = await Swal.fire( {
      title: '¿Seguro que deseas eliminar este owner?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2A2A2A',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
      }
    } );

    if ( !result.isConfirmed ) return;


    const respuesta = await fetchConToken( `owners/eliminar/${ owner.id }`, {}, "PUT" );



    if ( respuesta.ok ) {
      setOwners( owners.filter( o => o.id !== owner.id ) );
      // Recargar lista
      const nuevaLista = await fetchConToken( `owners/${ mapaSeleccionado.id }` );
      setOwners( nuevaLista.owners || [] );

    } else {
      setError( respuesta.msg || "Error al eliminar owner" );
    }
  };

  const ownersFiltrados = owners?.filter( owner =>
    owner.unidadOperativa.nombre.toLowerCase().includes( filtro.toLowerCase() ) ||
    owner.director.toLowerCase().includes( filtro.toLowerCase() ) ||
    owner.correo.toLowerCase().includes( filtro.toLowerCase() ) ||
    owner.unidadOperativa.siglas.toLowerCase().includes( filtro.toLowerCase() )
  );

  const totalItems = ownersFiltrados.length;

  const mostrarTodos = itemsPorPagina === 0;

  const ownersPaginados = mostrarTodos
    ? ownersFiltrados
    : ownersFiltrados.slice(
      ( paginaActual - 1 ) * itemsPorPagina,
      paginaActual * itemsPorPagina
    );

  return (
    <div className="flex flex-col  w-full justify-center items-center shadow-lg p-5">
      <BotonRegresar url="/config" nombre="Configuración" />
      <h1 className="text-xl font-bold text-center">Configuración de Owners</h1>
      <div className="flex justify-end mb-4">
        <ListaMapas mapas={ mapas || [] } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />

      </div>
      <div className="flex flex-col gap-2 w-full  ">
        { loading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : owners.length > 0 ? (
          <div className="flex flex-col gap-4  items-center ">

            <div className="flex items-center justify-between gap-2 w-full bg-white p-2 rounded-lg">
              <div className="relative w-1/2">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoIosSearch />
                </span>
                <Input
                  placeholder="Buscar ..."
                  value={ filtro }
                  onChange={ e => setFiltro( e.target.value ) }
                  className="pl-8" // Deja espacio para el ícono
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoIosClose size={ 25 } onClick={ () => setFiltro( "" ) } />
                </span>
              </div>
              <Dialog open={ open } onOpenChange={ ( value ) => {
                setOpen( value );
                if ( !value ) {
                  setError( "" );
                  setEditOwner( null );
                }
              } }>
                <DialogTrigger asChild>
                  <Button className="" onClick={ () => { setOpen( true ); setEditOwner( null ); } }>
                    <IoIosAddCircleOutline />
                    Agregar dueño de proceso
                  </Button>
                </DialogTrigger>
                <DialogContent  >
                  <DialogHeader>
                    <DialogTitle>{ editOwner ? "Editar dueño de proceso" : "Nuevo dueño de proceso" }</DialogTitle>
                    { error && <span className="text-red-500">{ `Error: ${ error }` }</span> }
                  </DialogHeader>
                  <DialogDescription>
                    Completa los campos para registrar un owner.
                  </DialogDescription>
                  <OwnerFormRegister
                    onSubmit={ handleSubmit }
                    initialValues={ editOwner ? editOwner : { mapaId: mapaSeleccionado?.id } }
                  />
                  <DialogFooter>
                    <Button onClick={ () => { setOpen( false ), setError( "" ); } }>Cancelar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>


            </div>

            <Table className=" rounded-5 bg-white rounded-lg overflow-hidden border border-gray-400">
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
                { ownersPaginados.map( ( owner, index ) => (
                  <TableRow key={ owner.id } className="hover:bg-gray-200">
                    <TableCell>{ index + 1 }</TableCell>
                    <TableCell className="whitespace-normal break-words">{ owner.unidadOperativa.nombre }</TableCell>
                    <TableCell>{ owner.unidadOperativa.siglas }</TableCell>
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

            <Paginacion
              totalItems={ totalItems }
              itemsPorPagina={ itemsPorPagina }
              paginaActual={ paginaActual }
              setPaginaActual={ setPaginaActual }
              setItemsPorPagina={ setItemsPorPagina }
            />

          </div>
        ) : (
          <div className="text-center text-gray-500">No hay owners registrados</div>
        ) }
      </div>
    </div>
  );
};