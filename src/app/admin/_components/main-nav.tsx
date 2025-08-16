

import {
  Calendar,
  ChevronRight,
  Home,
  Inbox,
  Users,
  BarChart3,
  FileText,
  Building,
  GraduationCap,
  BookOpen,
  CreditCard,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { ROUTES } from "@/model/constants/router"


// Menu items for the dashboard
const items = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Students",
    url: "/dashboard/students",
    icon: GraduationCap,
    items: [
      {
        title: "All Students",
        url: "/dashboard/students",
      },
      {
        title: "Add Student",
        url: "/dashboard/students/add",
      },
      {
        title: "Student Reports",
        url: "/dashboard/students/reports",
      },
    ],
  },
  {
    title: "Teachers",
    url: "/dashboard/teachers",
    icon: Users,
    items: [
      {
        title: "All Teachers",
        url: "/dashboard/teachers",
      },
      {
        title: "Add Teacher",
        url: "/dashboard/teachers/add",
      },
      {
        title: "Teacher Schedule",
        url: "/dashboard/teachers/schedule",
      },
    ],
  },
  {
    title: "Courses",
    url: ROUTES.DASHBOARD_COURSES,
    icon: BookOpen,
  },
  {
    title: "Departments",
    url: "/dashboard/departments",
    icon: Building,
  },
  {
    title: "Finance",
    url: "/dashboard/finance",
    icon: CreditCard,
    items: [
      {
        title: "Overview",
        url: "/dashboard/finance",
      },
      {
        title: "Fees",
        url: "/dashboard/finance/fees",
      },
      {
        title: "Payments",
        url: "/dashboard/finance/payments",
      },
      {
        title: "Reports",
        url: "/dashboard/finance/reports",
      },
    ],
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FileText,
  },
]

const MainNav = () => {
  return (
    <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
  )
}
export default MainNav