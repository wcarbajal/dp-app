import { AuthContext } from '@/auth/AuthContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';


export const useSocket = ( serverPath ) => {

  const [ socket, setSocket ] = useState( null );
  const [ online, setOnline ] = useState( false );
  const [ connectionError, setConnectionError ] = useState( null );
  const { auth } = useContext( AuthContext );

  const conectarSocket = useCallback( () => {

    const token = localStorage.getItem( 'token' );

    // Si no hay token, no intentar conectar
    if ( !token ) {
      setConnectionError( 'No hay token de autenticación' );
      return;
    }

    const tokenTemp = io.connect( serverPath, {
      transports: [ 'websocket' ],
      autoConnect: true,
      forceNew: true,
      timeout: 3000, // Reducido a 3 segundos
      reconnection: true,
      reconnectionAttempts: 3, // Solo 3 intentos
      reconnectionDelay: 1000, // 1 segundo entre intentos
      query: {
        'x-token': token
      }
    } );

    // Manejo de errores de conexión
    tokenTemp.on('connect_error', (error) => {
      console.error('Error de conexión Socket.IO:', error);
      setOnline(false);
      setConnectionError(error.message);
    });

    tokenTemp.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
      setOnline(false);
    });

    tokenTemp.on('connect', () => {
      console.log('Socket conectado exitosamente');
      setOnline(true);
      setConnectionError(null);
    });

    setSocket( tokenTemp );
    
  }, [ serverPath ] );

  const desconectarSocket = useCallback( () => {
    socket?.disconnect();
  }, [ socket ] );

  useEffect( () => {
    setOnline( socket?.connected );
  }, [ socket ] );

// desconectar socket cuando el usuario no está logueado
   useEffect( () => {
    if ( !auth.logged && socket ) {
      socket?.disconnect();
    }
  }, [ auth, online, socket ] );


  useEffect( () => {
    socket?.on( 'connect', () => setOnline( true ) );
  }, [ socket ] );

  useEffect( () => {
    socket?.on( 'disconnect', () => setOnline( false ) );
  }, [ socket ] );

  return {
    socket,
    online,
    connectionError,
    conectarSocket,
    desconectarSocket
  };
};