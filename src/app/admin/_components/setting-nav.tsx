import {
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bell, HelpCircle, Settings } from "lucide-react";
import Link from "next/link";

// Additional menu items for settings
const settingsItems = [
   {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
   },
   {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
   },
   {
      title: "Help & Support",
      url: "/dashboard/support",
      icon: HelpCircle,
   },
];

const SettingNav = () => {
   return (
      <SidebarGroup>
         <SidebarGroupLabel>System</SidebarGroupLabel>
         <SidebarGroupContent>
            <SidebarMenu>
               {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton asChild>
                        <Link href={item.url}>
                           <item.icon />
                           <span>{item.title}</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               ))}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
};
export default SettingNav;
