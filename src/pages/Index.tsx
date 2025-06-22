import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardMetrics } from "@/components/DashboardMetrics"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {/* Hero Section with Enhanced Gradient */}
      <div className="gradient-bg-medical relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative">
          <header className="container-custom section-spacing">
            <div className="flex items-center gap-4 mb-12">
              <SidebarTrigger className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200" />
              <div className="animate-fade-in-up">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
                  Clinical Trials <span className="text-blue-200">Dashboard</span>
                </h1>
                <p className="text-blue-100 text-xl lg:text-2xl font-light">
                  AI-Powered Patient-Trial Matching Analytics
                </p>
              </div>
            </div>
            
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-morphism rounded-3xl p-8 text-center animate-scale-in group hover:scale-105 transition-all duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">94.2%</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Match Accuracy</div>
                <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mt-4 group-hover:bg-white/50 transition-colors"></div>
              </div>
              <div className="glass-morphism rounded-3xl p-8 text-center animate-scale-in group hover:scale-105 transition-all duration-300" style={{animationDelay: '0.1s'}}>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">1,247</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Patients Processed</div>
                <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mt-4 group-hover:bg-white/50 transition-colors"></div>
              </div>
              <div className="glass-morphism rounded-3xl p-8 text-center animate-scale-in group hover:scale-105 transition-all duration-300" style={{animationDelay: '0.2s'}}>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">156</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Active Trials</div>
                <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mt-4 group-hover:bg-white/50 transition-colors"></div>
              </div>
              <div className="glass-morphism rounded-3xl p-8 text-center animate-scale-in group hover:scale-105 transition-all duration-300" style={{animationDelay: '0.3s'}}>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">2.3s</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Avg Response Time</div>
                <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mt-4 group-hover:bg-white/50 transition-colors"></div>
              </div>
            </div>
          </header>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container-custom -mt-16 relative z-10 pb-16">
        <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <DashboardMetrics />
        </div>
      </main>
    </div>
  )
}

export default Index