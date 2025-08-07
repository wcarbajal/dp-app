import { AuthContext } from '@/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useContext } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosBody, IoIosBriefcase, IoIosLogOut } from 'react-icons/io';
import { Link } from 'react-router';

export const UserHeader = () => {

  const { auth, logout } = useContext( AuthContext );

  return (
    <article className="flex items-center gap-1 ">
      <Avatar className="rounded-lg">
        <AvatarImage
          src="https://github.com/evilrabbit.png"
          alt="@evilrabbit"
        />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>

      <div className="ml-4">
        <h2 className="text-sm font-semibold">{ auth?.name }</h2>
        <p className="text-xs text-gray-500">{ auth?.correo }</p>
      </div>

      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <BsThreeDotsVertical className="text-xl" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/perfil" className="flex items-center">
              <IoIosBriefcase className="mr-2 my-2" /> Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={ logout }>

            <IoIosLogOut className="mr-2" /> Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>
    </article>
  );
};