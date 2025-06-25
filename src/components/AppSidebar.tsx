import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Users, Search, FileText, Settings, Activity } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Patient Info",
    url: "/patient-info",
    icon: Users,
  },
  {
    title: "Match Trials",
    url: "/match-trials",
    icon: Search,
  },
  {
    title: "Trials",
    url: "/trials",
    icon: FileText,
  },
  {
    title: "Protocol Optimization",
    url: "/protocol-optimization",
    icon: Activity,
  },
  {
    title: "About",
    url: "/about",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Clinical Trials</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500">
          Clinical Trials Management System
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}