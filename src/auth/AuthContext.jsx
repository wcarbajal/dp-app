
import { useCallback,  useState } from 'react';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { createContext } from 'react';
import { SocketContext } from '@/context/SocketContext';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();


const initialState = {
  id: null,
  checking: true,
  logged: false,
  name: null,
  correo: null
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
        name: usuario.nombre,
        correo: usuario.correo
      } );
      console.log( "Autenticado!" );
    }
    return respuesta.ok;


  };

  const register = async ( nombre, correo, password, rol  ) => {

    const respuesta = await fetchSinToken( 'login/registrar',
      {
        nombre,
        correo,
        password,
        rol: rol || 'USER'
      },
      'POST' );

    
console.log("respuesta del fetchSin token", respuesta)

    if ( respuesta.ok ) {
      
      localStorage.setItem( 'token', respuesta.token );
      const { usuario } = respuesta;

      setAuth( {
        uid: usuario.id,
        checking: false,
        logged: true,
        name: usuario.nombre,
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
        name: null,
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
        name: usuario.nombre,
        correo: usuario.correo
      } );
      console.log( "Autenticado con token renovado!" );
      return true;
    } else {
      setAuth( {
        id: null,
        checking: false,
        logged: false,
        name: null,
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
      name: null,
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