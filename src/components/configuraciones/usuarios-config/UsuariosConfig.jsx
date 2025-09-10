import { useCallback, useContext, useEffect, useState } from "react";
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

import { MdOutlineDeleteForever } from 'react-icons/md';
import { BotonRegresar } from '@/components/propios/BotonRegresar';

import { ListaMapas } from '@/components/ListaMapas';
import { cargarMapas } from '@/helpers/mapas';
import Swal from 'sweetalert2';
import { Input } from '@/components/ui/input';

import { Paginacion } from '@/components/paginacion/Paginacion';
import { UsuariosRegister } from './UsuariosRegister';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IoEyeOutline } from 'react-icons/io5';
import { capitalizarTexto } from '@/helpers/string';
import { AuthContext } from '@/auth/AuthContext';



export const UsuarioConfig = () => {
   const { auth } = useContext( AuthContext );
   

  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );
  const [ usuarios, setUsuarios ] = useState( [] );
  const [ open, setOpen ] = useState( false );
  const [ editUsuario, setEditUsuario ] = useState( null );
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

  const cargarUsuarios = useCallback( async () => {

    if ( !mapaSeleccionado ) return;
    try {
      const respuesta = await fetchConToken( `usuario/${ mapaSeleccionado.id }` );
      
      let usuariosPermitidos = [];

      if ( auth.rol !== 'ADMIN' ) {
         usuariosPermitidos = respuesta.usuarios.filter( usuario => usuario.rol.rol !== 'ADMIN' );
        
      }else{
          usuariosPermitidos = respuesta.usuarios;
      }

      if ( respuesta.ok ) {
        setUsuarios( usuariosPermitidos );

      } else {
        setUsuarios( [] );
      }
    } catch ( error ) {
      setUsuarios( [] );
      console.error( "Error al cargar las unidades operativas: ", error );
    }
  }, [ mapaSeleccionado, auth ] );

  // Cargar owners al montar
  useEffect( () => {
    cargarUsuarios();
  }, [ cargarUsuarios ] );

  // mostra

  // Crear o editar owner
  const handleSubmit = async ( data ) => {

    console.log( { data } );


    try {
      let respuesta;
      if ( editUsuario ) {
        respuesta = await fetchConToken( `unidad-operativa/${ editUsuario.id }`, data, "PUT" );


      } else {
        respuesta = await fetchConToken( "unidad-operativa", data, "POST" );

      }
      if ( respuesta.ok ) {
        setOpen( false );
        setError( "" );
        setEditUsuario( null );
        // Recargar lista
        const nuevaLista = await fetchConToken( `unidad-operativa/${ mapaSeleccionado.id }` );
        setUsuarios( nuevaLista.unidadesFuncionales || [] );

      } else {
        setError( respuesta.msg || "Error al cargar unidades funcionales" );
      }
    } catch ( error ) {
      console.log( error );
      setError( "Error de red" );
    }
  };

  // Eliminar unidad funcional
  const eliminarUsuario = async ( unidadFuncional ) => {


    const result = await Swal.fire( {
      title: '¿Seguro que deseas eliminar esta unidad funcional?',
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

    //eliminacion
    const respuesta = await fetchConToken( `unidad-operativa/eliminar/${ unidadFuncional.id }`, {}, "PUT" );

    if ( respuesta.ok ) {
      setUsuarios( usuarios?.filter( o => o.id !== unidadFuncional.id ) );
      // Recargar lista
      /*  const nuevaLista = await fetchConToken( `unidad-operativa/${ mapaSeleccionado.id }` );
       setUnidadesFuncionales( nuevaLista.unidadesFuncionales || [] );
  */
      Swal.fire( {
        title: 'Confirmación de eliminación',
        text: "La unidad funcional ha sido eliminada.",
        icon: 'success',
        confirmButtonColor: '#2A2A2A',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        }
      } );


      //setUnidadesFuncionales( nuevaLista.unidadesFuncionales || [] );

    } else {
      setError( respuesta.msg || "Error al eliminar unidad funcional" );
    }
  };

  const usuariosFiltrados = usuarios?.filter( unidadFuncional =>
    unidadFuncional.nombre.toLowerCase().includes( filtro.toLowerCase() ) ||
    unidadFuncional.siglas.toLowerCase().includes( filtro.toLowerCase() )

  );

  const totalItems = usuariosFiltrados.length;

  const mostrarTodos = itemsPorPagina === 0;

  const usuariosPaginados = mostrarTodos
    ? usuariosFiltrados
    : usuariosFiltrados.slice(
      ( paginaActual - 1 ) * itemsPorPagina,
      paginaActual * itemsPorPagina
    );


  // mostrar en consola, los errores
  useEffect( () => {
    if ( error ) {
      console.error( "Error en UnidadFuncionalConfig: ", error );
    }
  }, [ error ] );


  return (
    <div className="flex flex-col  w-full justify-center items-center shadow-lg p-4">
      <BotonRegresar url="/config" nombre="Configuración" />
      <h1 className="text-xl font-bold text-center">Configuración de Unidades Funcionales</h1>
      <div className="flex justify-end mb-4">
        <ListaMapas mapas={ mapas || [] } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />

      </div>
      <div className="flex flex-col  w-full  ">
        { loading
          ? ( <div className="text-center text-gray-500">Cargando...</div> )
          : (
            <div className="flex flex-col   items-center ">

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
                    setEditUsuario( null );
                  }
                } }>
                  <DialogTrigger asChild>
                    <Button className="" onClick={ () => { setOpen( true ); setEditUsuario( null ); } }>
                      <IoIosAddCircleOutline />
                      Agregar usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent  >
                    <DialogHeader>
                      <DialogTitle>{ editUsuario ? "Editar unidad operativa" : "Nueva unidad operativa" }</DialogTitle>
                      { error && <span className="text-red-500">{ `Error: ${ error }` }</span> }
                    </DialogHeader>
                    <DialogDescription>
                      Completa los campos para registrar un usuario.
                    </DialogDescription>
                    <UsuariosRegister
                      onSubmit={ handleSubmit }
                      initialValues={ editUsuario ? editUsuario : { mapaId: mapaSeleccionado?.id } }
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
                    <TableHead className="border-r border-gray-300 ">Imagen</TableHead>
                    <TableHead className="border-r border-gray-300 ">Nombres</TableHead>
                    <TableHead className="border-r border-gray-300 ">Apellido paterno</TableHead>
                    <TableHead className="border-r border-gray-300 ">Apellido materno</TableHead>
                    <TableHead className="border-r border-gray-300 ">Correo</TableHead>
                    <TableHead className="border-r border-gray-300 ">Rol</TableHead>
                    
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  { usuariosPaginados.map( ( usuario, index ) => (
                    <TableRow key={ usuario.id } className="hover:bg-gray-200">
                      <TableCell>{ ( paginaActual - 1 ) * itemsPorPagina + index + 1 }</TableCell>
                      <TableCell className="whitespace-normal break-words">
                        <Avatar  >
                          <AvatarImage src="https://github.com/shadcn.png"  />
                          <AvatarFallback>{ usuario?.nombre?.charAt( 0 ) + usuario?.apellidoPaterno?.charAt( 0 ) }</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="whitespace-normal break-words">{ usuario?.nombre }</TableCell>
                      <TableCell className="whitespace-normal break-words">{ usuario?.apellidoPaterno }</TableCell>
                      <TableCell className="whitespace-normal break-words">{ usuario?.apellidoMaterno }</TableCell>
                      <TableCell className="whitespace-normal break-words">{ usuario?.correo }</TableCell>
                      <TableCell className="whitespace-normal break-words">{ capitalizarTexto( usuario?.rol?.rol) }</TableCell>

                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" onClick={ () => { setEditUsuario( usuario ); setOpen( true ); } }>
                            <IoEyeOutline />
                          </Button>                         
                          <Button variant="destructive" onClick={ () => eliminarUsuario( usuario ) }>
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
          )
        }
      </div>
    </div>
  );
};