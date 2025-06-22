import { Calendar, Home, Users, FileText, Settings, Activity, Beaker } from "lucide-react"
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

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Match Trials",
    url: "/match-trials",
    icon: Activity,
  },
  {
    title: "Trials",
    url: "/trials",
    icon: Beaker,
  },
  {
    title: "Patient Info",
    url: "/patient-info",
    icon: Users,
  },
  {
    title: "Protocol Optimization",
    url: "/protocol-optimization",
    icon: Settings,
  },
  {
    title: "About",
    url: "/about",
    icon: FileText,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r-0 shadow-xl">
      <SidebarHeader className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ClinicalMatch</h2>
            <p className="text-blue-100 text-sm">AI Trial Matching</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white">
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-gray-500 font-medium mb-4">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="rounded-xl h-12 px-4 hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 transition-all duration-200"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-6 bg-gray-50 border-t">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="text-xs text-gray-600">
            <p className="font-medium">Clinical Trials Platform</p>
            <p className="text-gray-400">v1.0.0</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}