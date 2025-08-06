import { Link, useLocation } from 'react-router';
import { Separator } from './ui/separator';

export const AsideBar = ( { open, items } ) => {
const location = useLocation();
  return (
      <aside
      className={ `fixed top-20 w-60 h-full bg-blue-300 shadow-lg transition-all duration-300 ${ open ? "left-0" : "-left-60"
        } flex flex-col items-center z-10` }
    >
      { items.map( ( item ) => {
        const isActive = location.pathname === item.url;
        return (
          <div key={ item.title } className="w-full p-2" >
            <Link to={ item.url }>
              <div className={ `cursor-pointer flex h-10 hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground ${ isActive ? "bg-primary text-primary-foreground" : ""
                }` }          >
                { item.icon && <item.icon /> }
                <span>{ item.title }</span>
              </div>
            </Link>
          </div>
        );
      } ) }



      <Separator />

    {/*   <NavMain items={ itemsNav.navMain } />

      <NavSecondary items={ itemsNav.navSecondary } className="mt-auto" /> */}


     {/*  <NavUser user={ {
        name: auth.name,
        email: auth.correo,
        avatar: "https://github.com/shadcn.png",
      } } /> */}


    </aside>
  )
}