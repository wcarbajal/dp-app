import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from 'react';
import { AuthContext } from '@/auth/AuthContext';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

export const RegisterPage = () => {

  const { register } = useContext( AuthContext );

  const [ form, setForm ] = useState( {
    nombre: '',
    correo: '',
    password: '',
    rol: ''
  } );


  const onChange = ( e ) => {

    const { name, value } = e.target;
    setForm( {
      ...form,
      [ name ]: value
    } );
  };

  const onSubmit = async ( e ) => {
    e.preventDefault();

    // Aquí podrías agregar la lógica para registrar al usuario, por ejemplo, enviando los datos a una API.
    const { nombre, correo, password, rol} = form;
    
    const respuesta = await register( nombre,correo, password, rol );
   
    if ( respuesta.status === 400 ) {
      // modificar el tema del swal
      
      return Swal.fire( {
        title: 'Error al registra al usuario',
        text:  respuesta.msg,
        icon: 'error',
        iconColor: '#2E2E2E', // azul tailwind-500
        confirmButtonColor: '#2A2A2A', // azul tailwind-500
        customClass: {
          confirmButton: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        },
      } );
      
    }

console.log("Usuario registrado correctamente");
      setForm( {
      nombre: '',
      correo: '',
      password: ''
    } ); 
  };

  const todoOk = () => {
    return ( form.nombre.length > 0 && form.correo.length > 0 && form.password.length > 0 ) ? true : false;
  };
  return (
    <div className="flex justify-center items-center h-screen">

      <div className={ cn( "flex flex-col gap-6" ) } >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Registro de nueva cuenta</CardTitle>
            <CardDescription>
              Cree una nueva cuenta para acceder a la aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={ onSubmit } className="space-y-6">
              <div className="grid gap-6">

                <div className="grid gap-6">

                  <div className="grid gap-3">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      required
                      id="nombre"
                      type="text"
                      placeholder="Juan Perez"
                      value={ form.nombre }
                      name="nombre"
                      onChange={ onChange }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="correo">Email</Label>
                    <Input
                      id="correo"
                      type="email"
                      placeholder="m@example.com"
                      required
                      name="correo"
                      value={ form.correo }
                      onChange={ onChange }
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Olvidaste tu password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={ form.password }
                      name="password"
                      onChange={ onChange }
                      placeholder="*********"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={ !todoOk() } >
                    Registrar
                  </Button>
                </div>
                <div className="text-center text-sm">
                  ¿Ya tienes una cuenta?{ " " }
                  <Link to="/auth/login" className="underline underline-offset-4">
                    Ingresa
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
