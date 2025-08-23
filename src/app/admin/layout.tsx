import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { DashboardHeader } from "./_components/dashboard-header"
import { requireAdminAccess } from "@/lib/data/admin/user-session";

const DashboardLayout = async ({children} : {children: React.ReactNode}) => {

  const session = await requireAdminAccess();
  
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
export default DashboardLayout