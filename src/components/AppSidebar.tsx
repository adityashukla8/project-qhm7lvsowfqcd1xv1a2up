import { Home, Search, FileText, Users, Settings, Activity, Target, Zap } from "lucide-react"
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
    title: "Clinical Trials",
    url: "/trials",
    icon: FileText,
  },
  {
    title: "Match Trials",
    url: "/match-trials",
    icon: Target,
  },
  {
    title: "Patient Info",
    url: "/patient-info",
    icon: Users,
  },
  {
    title: "Protocol Optimization",
    url: "/protocol-optimization",
    icon: Zap,
  },
  {
    title: "About",
    url: "/about",
    icon: Activity,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-gray-200/50 bg-white/95 backdrop-blur-xl">
      <SidebarHeader className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient">CriteriAI</h2>
            <p className="text-xs text-gray-500 font-medium">Clinical Intelligence</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        w-full rounded-xl transition-all duration-300 group
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'hover:bg-gray-100/80 text-gray-700 hover:text-gray-900'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                        <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-gray-500'
                        }`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-6 border-t border-gray-200/50">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">Powered by AI</div>
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}