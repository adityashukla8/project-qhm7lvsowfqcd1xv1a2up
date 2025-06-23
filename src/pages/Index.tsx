import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardMetrics } from "@/components/DashboardMetrics"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero Header with Gradient */}
      <div className="gradient-bg-medical relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div className="animate-fade-in">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">CriteriAI Dashboard</h1>
                <p className="text-blue-100 text-base sm:text-lg">AI-Driven Clinical Trial Optimization</p>
              </div>
            </div>
          </header>
        </div>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10">
        <div className="animate-slide-up">
          <DashboardMetrics />
        </div>
      </main>
    </div>
  )
}

export default Index