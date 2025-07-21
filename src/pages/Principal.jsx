import { AppSidebar } from "@/components/app-sidebar";
/* import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table" */
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet } from 'react-router';

//import data from "./data.json"


export const PrincipalPage = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 50)",
          "--header-height": "calc(var(--spacing) * 12)",
        }
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
              <Outlet />
            
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
/* export const metadata = {
  title: "Dashboard",
  description: "Dashboard page with interactive charts and data tables.",
} */