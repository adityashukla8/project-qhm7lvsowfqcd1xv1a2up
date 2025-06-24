import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Info, Search, FileText, Users, Settings, Activity } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

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
    title: "Clinical Trials",
    url: "/trials",
    icon: FileText,
  },
  {
    title: "Patient Info",
    url: "/patient-info",
    icon: Users,
  },
  {
    title: "Agentic Workflow",
    url: "/agentic-workflow",
    icon: Activity,
  },
  {
    title: "Protocol Optimization",
    url: "/protocol-optimization",
    icon: Settings,
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CriteriAI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
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
    </Sidebar>
  )
}