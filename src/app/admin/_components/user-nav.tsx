
import Avatar from "@/components/commons/misc/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { ChevronUp, LogOut, Settings, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface IProps {
   name:string;
   email:string;
   avatar?:string;
}

const UserNav = () => {

   const {data:session,isPending} = authClient.useSession();
   const router = useRouter();

   if(isPending)
      return null;

   async function handleSignOut() {
      await authClient.signOut({
         fetchOptions:{
            onSuccess:() => {
               // Handle successful sign out
               toast.success("Signed out successfully");
               router.push("/");
            },
            onError:(error) => {
               // Handle sign out error
               toast.error("Failed to sign out");
            }
         }
      });
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <SidebarMenuButton
               size="lg"
               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
               <Avatar
                  image={session?.user?.image}
                  name={session?.user?.name ?? ""}
               />
               <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session?.user?.name ?? ""}</span>
                  <span className="truncate text-xs">{session?.user?.email ?? ""}</span>
               </div>
               <ChevronUp className="ml-auto size-4" />
            </SidebarMenuButton>
         </DropdownMenuTrigger>
         <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
         >
            <DropdownMenuItem asChild>
               <Link href="/dashboard/profile">
                  <User2 className="h-4 w-4" />
                  Profile
               </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  Settings
               </Link>
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={handleSignOut}>
               <LogOut className="h-4 w-4" />
               Sign out
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
export default UserNav;
