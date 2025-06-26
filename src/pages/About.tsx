import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Bot, Zap } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600">
        <header className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20 p-2" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">About Criteria-AI</h1>
              <p className="text-blue-100 text-sm sm:text-base mt-1">AI-Driven Clinical Trials Matching System</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Activity className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Platform Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Criteria-AI is an advanced AI-powered platform designed to revolutionize the way patients 
                are matched with clinical trials. Using multi-agent systems and sophisticated algorithms, 
                we provide healthcare professionals with the tools they need to find the most suitable 
                clinical trials for their patients.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Bot className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Multi-Agent System</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm sm:text-base">
                  Our platform utilizes multiple AI agents working in coordination to analyze patient 
                  data, search clinical trial databases, and provide comprehensive matching recommendations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <span>Advanced Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm sm:text-base">
                  Equipped with state-of-the-art tools for data processing, natural language understanding, 
                  and clinical protocol analysis to ensure accurate and relevant matches.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>Key Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">Intelligent patient-trial matching based on medical history and eligibility criteria</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">Real-time analytics and performance monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">Automated summary generation for matched trials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">Protocol optimization recommendations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default About