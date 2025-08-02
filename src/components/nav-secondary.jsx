"use client";
import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from 'react-router';

export function NavSecondary( {
  items,
  ...props
} ) {

  const location = useLocation();
  return (
    <SidebarGroup { ...props }>
      <SidebarGroupContent>
        <SidebarMenu>
          { items.map( ( item ) => {
            // Marca activo si la ruta actual inicia con el url del item
            const isActive = location.pathname.startsWith( item.url );

            return (
              <SidebarMenuItem key={ item.title }>
                <SidebarMenuButton
                  asChild
                  className={ `cursor-pointer hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground ${ isActive ? "bg-primary text-primary-foreground" : "" }` }
                >
                  <Link to={ item.url }>
                    <item.icon />
                    <span>{ item.title }</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          } ) }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
