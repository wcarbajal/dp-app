import { useContext, useState } from "react";
import { AuthContext } from "@/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PerfilUserForm } from '@/components/perfil/PerfilUserForm';


export const PerfilUser = () => {

  const [ open, setOpen ] = useState( false );

  const { auth } = useContext( AuthContext );

  if ( !auth ) {
    return <div className="text-center text-red-500">No se ha encontrado información del usuario.</div>;
  }

  return (
    <section className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-100 to-slate-200">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="flex flex-col items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg mt-4">
            <AvatarImage src={ auth?.avatar || "https://github.com/evilrabbit.png" } alt={ auth?.name || "User" } />
            <AvatarFallback>
              { auth?.name ? auth.name[ 0 ].toUpperCase() : "U" }
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-white text-2xl mt-2">{ auth?.name || "Usuario" }</CardTitle>
          <CardDescription className="text-blue-100">{ auth?.correo || "correo@ejemplo.com" }</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 py-8">
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-semibold text-gray-700">ID:</span>
              <span className="ml-2 text-gray-500">{ auth?.id || "N/A" }</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Nombre:</span>
              <span className="ml-2 text-gray-500">{ auth?.name || "N/A" }</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Correo:</span>
              <span className="ml-2 text-gray-500">{ auth?.correo || "N/A" }</span>
            </div>
          </div>
          <Button className="w-full mt-4" variant="outline" onClick={ () => setOpen( true ) }>
            Editar perfil
          </Button>
        </CardContent>
      </Card>

      {/* Modal de edición */ }
      <Dialog open={ open } onOpenChange={ setOpen }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          
          <PerfilUserForm user={auth} onClose={() => setOpen(false)} /> 
          
          <DialogFooter>
            <Button variant="outline" onClick={ () => setOpen( false ) }>
              Cancelar
            </Button>
            <Button>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  ) 
};