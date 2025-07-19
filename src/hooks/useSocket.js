import { AuthContext } from '@/auth/AuthContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';


export const useSocket = ( serverPath ) => {

  //const socket = useMemo(() => io.connect( serverPath, {transports: ['websocket']} ), [ serverPath ] );
  const [ socket, setSocket ] = useState( null );

  const [ online, setOnline ] = useState( false );
  const { auth } = useContext( AuthContext );

  const conectarSocket = useCallback( () => {

    const token = localStorage.getItem( 'token' );

    const tokenTemp = io.connect( serverPath, {
      transports: [ 'websocket' ],
      autoConnet: true,
      forceNew: true,
      query: {
        'x-token': token
      }
    } );
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
    conectarSocket,
    desconectarSocket
  };
};