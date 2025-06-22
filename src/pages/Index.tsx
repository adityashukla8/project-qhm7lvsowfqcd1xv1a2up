import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardMetrics } from "@/components/DashboardMetrics"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero Header with Gradient */}
      <div className="gradient-bg-medical relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <header className="px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-2">Clinical Trials Dashboard</h1>
                <p className="text-blue-100 text-lg">AI-Powered Patient-Trial Matching Analytics</p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="glass-effect rounded-2xl p-6 text-center animate-slide-up">
                <div className="text-2xl font-bold text-white mb-1">94.2%</div>
                <div className="text-blue-100 text-sm">Match Accuracy</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="text-2xl font-bold text-white mb-1">1,247</div>
                <div className="text-blue-100 text-sm">Patients Processed</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl font-bold text-white mb-1">156</div>
                <div className="text-blue-100 text-sm">Active Trials</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center animate-slide-up" style={{animationDelay: '0.3s'}}>
                <div className="text-2xl font-bold text-white mb-1">2.3s</div>
                <div className="text-blue-100 text-sm">Avg Response Time</div>
              </div>
            </div>
          </header>
        </div>
      </div>
      
      <main className="p-8 -mt-4 relative z-10">
        <div className="animate-slide-up">
          <DashboardMetrics />
        </div>
      </main>
    </div>
  )
}

export default Index