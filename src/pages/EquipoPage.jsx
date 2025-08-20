import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { ListaMapas } from '@/components/ListaMapas';
import { cargarMapas } from '@/helpers/mapas';

export const EquipoPage = () => {

  const [ loading, setLoading ] = useState( true );
  const [ mapas, setMapas ] = useState( null );
  const [ mapaSeleccionado, setMapaSeleccionado ] = useState( null );

  const [ usuarios, setUsuarios ] = useState( [] );
  const [ procesos, setProcesos ] = useState( [] );
  const [ modalUsuario, setModalUsuario ] = useState( null );
  //const [modalAsignar, setModalAsignar] = useState(null);
  const [ nuevoUsuario, setNuevoUsuario ] = useState( { nombre: "", email: "" } );

  useEffect( () => {
    const obtenerMapas = async () => {
      setLoading( true );
      const mapas = await cargarMapas();
      setMapas( mapas );
      setLoading( false );
    };
    obtenerMapas();
  }, [ mapaSeleccionado ] );

  // Cargar usuarios y procesos
  useEffect( () => {
    fetch( "/api/usuarios" ).then( r => r.json() ).then( setUsuarios );
    fetch( "/api/procesos" ).then( r => r.json() ).then( setProcesos );
  }, [] );

  // Crear usuario
  const crearUsuario = async () => {
    const res = await fetch( "/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( nuevoUsuario ),
    } );
    if ( res.ok ) {
      setUsuarios( [ ...usuarios, await res.json() ] );
      setNuevoUsuario( { nombre: "", email: "" } );
    }
  };

  // Editar usuario
  const editarUsuario = async ( id, datos ) => {
    const res = await fetch( `/api/usuarios/${ id }`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( datos ),
    } );
    if ( res.ok ) {
      setUsuarios( usuarios.map( u => ( u.id === id ? { ...u, ...datos } : u ) ) );
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async ( id ) => {
    if ( !window.confirm( "¿Eliminar usuario?" ) ) return;
    const res = await fetch( `/api/usuarios/${ id }`, { method: "DELETE" } );
    if ( res.ok ) setUsuarios( usuarios.filter( u => u.id !== id ) );
  };

  // Asignar responsable a proceso
  const asignarResponsable = async ( usuarioId, procesoId ) => {
    const res = await fetch( `/api/procesos/${ procesoId }/asignar-responsable`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( { usuarioId } ),
    } );
    if ( res.ok ) alert( "Responsable asignado" );
  };

  // Obtener procesos asignados a un usuario
  const obtenerProcesosUsuario = async ( usuarioId ) => {
    const res = await fetch( `/api/usuarios/${ usuarioId }/procesos` );
    return res.ok ? res.json() : [];
  };

  return (
    <article className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold text-center  ">Equipo de trabajo por entidad</h1>

      { loading
        ? ( <span className="text-center text-gray-500">Cargando...</span> )
        : (
          <>
            <ListaMapas mapas={ mapas } setMapaSeleccionado={ setMapaSeleccionado } mapaSeleccionado={ mapaSeleccionado } />
            {
              mapaSeleccionado && (
                <Card className="mb-4 p-5">
                  <h1 className="text-xl font-bold mb-4">Equipo</h1>
                  {/* Crear usuario */ }
                  <section className="flex gap-2 mb-4">
                    <Input
                      placeholder="Nombre"
                      value={ nuevoUsuario.nombre }
                      onChange={ e => setNuevoUsuario( { ...nuevoUsuario, nombre: e.target.value } ) }
                    />
                    <Input
                      placeholder="Email"
                      value={ nuevoUsuario.email }
                      onChange={ e => setNuevoUsuario( { ...nuevoUsuario, email: e.target.value } ) }
                    />
                    <Button onClick={ crearUsuario }>Crear</Button>
                  </section>
                  {/* Listado de usuarios */ }
                  <section>
                    <table className="min-w-full border text-xs mb-4">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">Nombre</th>
                          <th className="border px-2 py-1">Email</th>
                          <th className="border px-2 py-1">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        { usuarios.map( usuario => (
                          <tr key={ usuario.id }>
                            <td className="border px-2 py-1">{ usuario.nombre }</td>
                            <td className="border px-2 py-1">{ usuario.email }</td>
                            <td className="border px-2 py-1 flex gap-1">
                              {/* Editar */ }
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">Editar</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogTitle>Editar usuario</DialogTitle>
                                  <Input
                                    value={ usuario.nombre }
                                    onChange={ e => editarUsuario( usuario.id, { nombre: e.target.value } ) }
                                  />
                                  <Input
                                    value={ usuario.email }
                                    onChange={ e => editarUsuario( usuario.id, { email: e.target.value } ) }
                                  />
                                </DialogContent>
                              </Dialog>
                              {/* Eliminar */ }
                              <Button size="sm" variant="destructive" onClick={ () => eliminarUsuario( usuario.id ) }>
                                Eliminar
                              </Button>
                              {/* Asignar responsable */ }
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="secondary">Asignar a proceso</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogTitle>Asignar como responsable</DialogTitle>
                                  <Label>Proceso</Label>
                                  <Select onValueChange={ procesoId => asignarResponsable( usuario.id, procesoId ) }>
                                    { procesos.map( p => (
                                      <SelectItem key={ p.id } value={ p.id }>{ p.nombre }</SelectItem>
                                    ) ) }
                                  </Select>
                                </DialogContent>
                              </Dialog>
                              {/* Ver procesos asignados */ }
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost" onClick={ async () => {
                                    const procesosAsignados = await obtenerProcesosUsuario( usuario.id );
                                    setModalUsuario( { ...usuario, procesos: procesosAsignados } );
                                  } }>
                                    Ver procesos
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogTitle>Procesos asignados a { usuario.nombre }</DialogTitle>
                                  <ul>
                                    { modalUsuario && modalUsuario.procesos
                                      ? modalUsuario.procesos.map( p => <li key={ p.id }>{ p.nombre }</li> )
                                      : <li>No tiene procesos asignados</li>
                                    }
                                  </ul>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ) ) }
                      </tbody>
                    </table>
                  </section>
                </Card>
              )
            }
          </>
        )
      }


    </article>
  );
};