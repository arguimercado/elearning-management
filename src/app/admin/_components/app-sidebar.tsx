"use client";

import { GraduationCap } from "lucide-react";

import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";

import UserNav from "./user-nav";
import SettingNav from "./setting-nav";
import MainNav from "./main-nav";

export function AppSidebar() {
   const { state } = useSidebar();

   return (
      <Sidebar collapsible="icon">
         <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="size-4" />
               </div>
               {state === "expanded" && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-semibold">EMS Admin</span>
                     <span className="truncate text-xs text-muted-foreground">
                        Education Management System
                     </span>
                  </div>
               )}
            </div>
         </SidebarHeader>
         
         <SidebarContent>
            <MainNav />
            <SettingNav />
         </SidebarContent>
         <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                  <UserNav />
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   );
}
