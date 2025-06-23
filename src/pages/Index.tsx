import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardMetrics } from "@/components/DashboardMetrics"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Modern Hero Header */}
      <div className="gradient-bg-medical relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl floating-delayed"></div>
        </div>
        <div className="relative">
          <header className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <SidebarTrigger className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-300" />
              <div className="animate-fade-in">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                  CriteriAI Dashboard
                </h1>
                <p className="text-blue-100 text-lg sm:text-xl font-medium">
                  AI-Driven Clinical Trial Intelligence Platform
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm font-medium">System Online</span>
                </div>
              </div>
            </div>
          </header>
        </div>
      </div>
      
      <main className="px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div className="animate-slide-up">
          <DashboardMetrics />
        </div>
      </main>
    </div>
  )
}

export default Index