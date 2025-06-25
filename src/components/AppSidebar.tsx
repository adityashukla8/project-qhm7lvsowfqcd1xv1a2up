import { Home, Search, FileText, Users, Info, Activity } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Menu items without Protocol Optimization
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
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
    title: "Patient Info",
    url: "/patient-info",
    icon: Users,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="border-b border-sidebar-border p-3 sm:p-4 bg-white">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-sidebar-foreground">Criteria-AI</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm px-3 sm:px-4">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 sm:p-4 border-t border-sidebar-border bg-white">
        <p className="text-xs text-sidebar-foreground/70 text-center leading-tight">AI-Driven Clinical Trials Matching System</p>
      </SidebarFooter>
    </Sidebar>
  )
}