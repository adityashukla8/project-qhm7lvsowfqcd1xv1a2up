import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardMetrics } from "@/components/DashboardMetrics"

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinical Trials Dashboard</h1>
            <p className="text-gray-600">Patient-Trial Matching Analytics</p>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <DashboardMetrics />
      </main>
    </div>
  )
}

export default Index