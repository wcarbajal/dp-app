/* import * as React from "react";
import { TiFlowMerge } from "react-icons/ti";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  AuthContext
} from '@/auth/AuthContext';

import { itemsNav } from './listNav';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link } from 'react-router';

export function AppSidebar( {
  ...props
} ) {
  const { auth } = React.useContext( AuthContext );

  return (
    <Sidebar collapsible="offcanvas" { ...props }>
      <SidebarHeader className=" border-b-1 shadow-lg">
        <SidebarMenu >
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="itemsNav-[slot=sidebar-menu-button]:!p-1.5">
              <Link to="/">
                <TiFlowMerge size={ 20 } />
                <span className="text-base font-semibold">Process doc</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent >
        <NavMain items={ itemsNav.navMain } />

        <NavSecondary items={ itemsNav.navSecondary } className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={ {
          name: auth.name,
          email: auth.correo,
          avatar: "https://github.com/shadcn.png",
        } } />
      </SidebarFooter>
    </Sidebar>
  );
}
 */