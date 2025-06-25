import { SidebarTrigger } from "@/components/ui/sidebar"
import { MetricsOverview } from "@/components/MetricsOverview"
import { ChatButton } from "@/components/ChatButton"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-blue-600">
        <header className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20 p-2" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Criteria-AI Dashboard</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1">AI-Driven Clinical Trials Matching System</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-6 lg:p-8 -mt-2 sm:-mt-4 relative z-10">
        <MetricsOverview />
      </main>
      
      <ChatButton />
    </div>
  )
}

export default Index