import { Link, useLocation } from 'react-router';
import { Separator } from './ui/separator';
import { GrConfigure } from "react-icons/gr";

export const AsideBar = ( { open, items } ) => {

  const location = useLocation();


  return (
    <aside
      className={ `fixed top-16 h-[calc(100vh-4rem)] -left-54 w-50 shadow-lg transition-all duration-300 ${ open ? "left-0" : "-left-54"
        } flex flex-col items-center z-10` }
    >
      <div className="flex flex-col w-full h-full  ">
        { items.map( ( item ) => {

          return (
            <div key={ item.title } className="w-full p-1 pl-2" >
              <Link to={ item.url }>
                <div className={ `-mx-2 px-5 cursor-pointer rounded-r-md flex items-center  gap-2 h-10 hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground ${ location.pathname === item.url ? "bg-primary text-primary-foreground" : ""
                  }` }          >
                  { item.icon && <item.icon className="text-2xl" /> }
                  <span>{ item.title }</span>
                </div>
              </Link>
            </div>
          );
        } ) }


        <Separator className="my-2 w-full" decorative="true" />

        <div className="w-full  p-1 pl-2 mt-auto">
          
          <Separator className="my-2 w-full" decorative="true" />

          <Link to="/config">
            <div >

              <div className={ `-mx-2 px-5 cursor-pointer rounded-r-md flex items-center  gap-2 h-10 hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground ${ location.pathname === "/config" ? "bg-primary text-primary-foreground" : ""
                }` }         >
                <GrConfigure />
                <span>Configuraciones</span>
              </div>
            </div>
          </Link>

        </div>

      </div>
    </aside>
  );
};