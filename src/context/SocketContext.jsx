import React, { useContext, useEffect } from 'react';
import { createContext } from 'react';

import { useSocket } from '../hooks/useSocket'
import { AuthContext } from '../auth/AuthContext';




// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {

    const { socket, online, conectarSocket, desconectarSocket  } = useSocket('http://localhost:8080');
    const { auth } = useContext( AuthContext );

      

    useEffect(() => {
      if (auth.logged){
        

        conectarSocket();
      }
    }, [auth, conectarSocket])

       useEffect(() => {

         
      if (!auth.logged){
        desconectarSocket();
      }
    }, [auth, desconectarSocket])
    //escuchar los cambios en los usuarios conectados
    useEffect(() => {
      socket?.on('si-logeado', (data)=> {
    console.log("Data enviada por el frontend",data)    
      })

    }, [socket])
    
    
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}