
import { useCallback, useState } from 'react';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { createContext } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

const initialState = {
  id: null,
  checking: true,
  logged: false,
  name: null,
  email: null
};

export const AuthProvider = ( { children } ) => {

  const [ auth, setAuth ] = useState( initialState );

  const login = async ( correo, password ) => {

    const respuesta = await fetchSinToken( 'login', { correo, password }, 'POST' );

    if ( respuesta.ok ) {

      localStorage.setItem( 'token', respuesta.token );
      const { usuario } = respuesta;

      setAuth( {
        uid: usuario.uid,
        checking: false,
        logged: true,
        name: usuario.nombre,
        email: usuario.email
      } );
    }
    return respuesta.ok;


  };

  const register = async ( nombre, correo, password ) => {

    const respuesta = await fetchSinToken( 'login/new', { nombre, correo, password }, 'POST' );

    if ( respuesta.ok ) {

      localStorage.setItem( 'token', respuesta.token );
      const { usuario } = respuesta;

      setAuth( {
        uid: usuario.uid,
        checking: false,
        logged: true,
        name: usuario.nombre,
        email: usuario.email
      } );
    }

    return respuesta;


  };

  const verificaToken = useCallback( async () => {

    const token = localStorage.getItem( 'token' );

    if ( !token ) {
      return setAuth( {
        uid: null,
        checking: false,
        logged: false,
        name: null,
        email: null
      } );
    }
     const resp = await fetchConToken( 'login/renew', {}, 'GET' );

     if (resp.ok) {
      localStorage.setItem( 'token', resp.token );
      const { usuario } = resp;

      setAuth( {
        uid: usuario.uid,
        checking: false,
        logged: true,
        name: usuario.nombre,
        email: usuario.email
      } );
      
      return true
     }else {
    return setAuth( {
        uid: null,
        checking: false,    
        logged: false,
        name: null,
        email: null
      } );
     }    
    

  }, [] );

  const logout = () => {
    localStorage.removeItem( 'token' );
    setAuth( {
      uid: null,
      checking: false,
      logged: false,
      
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