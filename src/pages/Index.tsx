import { SidebarTrigger } from "@/components/ui/sidebar"
import { MetricsOverview } from "@/components/MetricsOverview"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-blue-600">
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Criteria-AI Dashboard</h1>
              <p className="text-blue-100 text-base sm:text-lg">AI-Driven Clinical Trials Matching System</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10">
        <MetricsOverview />
      </main>
    </div>
  )
}

export default Index