
import { useCallback,  useState } from 'react';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { createContext } from 'react';



// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();


const initialState = {
  id: null,
  checking: true,
  logged: false,
  nombre: null,
  apellidoPaterno: null,
  apellidoMaterno: null,
  correo: null,
  img: null,
  rol: null
};

export const AuthProvider = ( { children } ) => {

  const [ auth, setAuth ] = useState( initialState );
  

  const login = async ( correo, password ) => {

    const respuesta = await fetchSinToken( 'login', { correo, password }, 'POST' );
    

    if ( respuesta.ok ) {

      localStorage.setItem( 'token', respuesta.token );
      const { usuario } = respuesta;

      setAuth( {
        id: usuario.id,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        rol: usuario.rol.rol,
        correo: usuario.correo,

      } );
      console.log( "Autenticado!" );

    }
    return respuesta.ok;


  };

  const register = async ( nombre, correo, password, rol, apellidoMaterno, apellidoPaterno ) => {

    const respuesta = await fetchSinToken( 'login/registrar',
      {
        nombre,
        correo,
        password,
        apellidoMaterno,
        apellidoPaterno,
        rol
      },
      'POST' );

    if ( respuesta.ok ) {
      
      localStorage.setItem( 'token', respuesta.token );
      const { usuario } = respuesta;

      setAuth( {
        uid: usuario.id,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        rol: usuario.rol.rol,
        correo: usuario.email
      } );
      console.log( "Autenticado!" );
      return true;
    }

    return respuesta;


  };

  const verificaToken = useCallback( async () => {

    const token = localStorage.getItem( 'token' );

    if ( !token ) {
      setAuth( {
        id: null,
        checking: false,
        logged: false,
        nombre: null,
        correo: null
      } );
      return false;
    }
    const resp = await fetchConToken( 'login/renovar' );

    if ( resp.ok ) {
      localStorage.setItem( 'token', resp.token );
      const { usuario } = resp;

      setAuth( {
        id: usuario.id,
        checking: false,
        logged: true,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        rol: usuario.rol?.rol,
        correo: usuario.correo
      } );
      console.log( "Autenticado con token renovado!" );
      return true;
    } else {
      setAuth( {
        id: null,
        checking: false,
        logged: false,
        nombre: null,
        correo: null
      } );
    }
    return false;
  }, [] );

  const logout = () => {
    localStorage.removeItem( 'token' );
    setAuth( {
      id: null,
      checking: false,
      logged: false,
      nombre: null,
      correo: null

    } );

  };

  return (

    <AuthContext.Provider value={ {
      login,
      register,
      verificaToken,
      logout,
      auth
    } }>
      { children }
    </AuthContext.Provider>
  );
};