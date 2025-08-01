import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/auth/AuthContext';
import Swal from 'sweetalert2';
import { Link } from 'react-router';



export const LoginPage = () => {

  const { login } = useContext( AuthContext )

  const [ form, setForm ] = useState( {
    email: 'test1@test.com',
    password: '123456',
    rememberme: false
  } );

  useEffect(() => {
    const remembermeEmail = localStorage.getItem( 'email' );
    if ( remembermeEmail ) {
      setForm( f => ({
        ...f,
        rememberme: true,
        email: remembermeEmail
      } ));
    }
  }, [])
  

  const onChange = ( e ) => {

    const { name, value } = e.target;
    setForm( {
      ...form,
      [ name ]: value
    } );
  };

  const toggleCheck = () => {
    setForm( {
      ...form,
      rememberme: !form.rememberme
    } );
  }
  const onSubmit = async ( e ) => {
    e.preventDefault();
    
    if( form.rememberme){ localStorage.setItem( 'email', form.email );      
    } else { localStorage.removeItem( 'email' ); }
    
    //TODO: conectar al backend
     const ok = await login( form.email, form.password );
     
     if( !ok){
              // modificar el tema del swal
              
          Swal.fire({
            title: 'Error al iniciar sesión',
            text: 'Por favor verifica tus credenciales',
            icon: 'error',
            iconColor: '#2E2E2E', // azul tailwind-500
            confirmButtonColor: '#2A2A2A', // azul tailwind-500
            customClass: {
              confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
            },
          });
          
        }
     

  };

  const todoOk = () => {
    return (form.email.length > 0 && form.password.length > 0) ? true : false;
  }

  return (
    <div className="flex justify-center items-center h-screen">

      <div className={ cn( "flex flex-col gap-6" ) } >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bienvenido nuevamente</CardTitle>
            <CardDescription>
              Inicie su sesión con su cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit= { onSubmit }
            >
              <div className="grid gap-6">
               
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={ form.email }
                      onChange={ onChange }
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link to="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Olvidó su contraseña?
                      </Link>
                    </div>
                    <input id="password" type="password" required name="password"
                      value={ form.password }
                      onChange={ onChange }

                    />
                  </div>
                  <div
                    className="flex"
                    onChange= {() => toggleCheck ()}
                  >

                    <input
                      className="w-9 h-4"
                      id="rememberme"
                      type="checkbox"
                      name="rememberme"
                      checked={ form.rememberme }
                      onChange= { onChange}

                    />
                    <Label htmlFor="rememberme" className=" w-full ml-2">
                      Recordarme
                    </Label>

                  </div>
                  <Button type="submit" className="w-full" disabled={ !todoOk() } >
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm">
                 ¿No tiene una cuenta?{ " " }
                  <Link to="/auth/register" className="underline underline-offset-4">
                    Registrese
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
         <div
          className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          Al hacer click en registrar, usted acepta nuestros <Link to="#">Terminos de Servicio</Link>{ " " }
          y <Link to="#">Politicas de privacidad</Link>.
        </div>
      </div>


    </div>
  );
};
