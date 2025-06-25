import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Bot, Zap } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600">
        <header className="px-6 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-2xl font-bold text-white">About Criteria-AI</h1>
              <p className="text-blue-100">AI-Driven Clinical Trials Matching System</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Criteria-AI is an advanced AI-powered platform designed to revolutionize the way patients 
                are matched with clinical trials. Using multi-agent systems and sophisticated algorithms, 
                we provide healthcare professionals with the tools they need to find the most suitable 
                clinical trials for their patients.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-600" />
                  Multi-Agent System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our platform utilizes multiple AI agents working in coordination to analyze patient 
                  data, search clinical trial databases, and provide comprehensive matching recommendations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Advanced Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Equipped with state-of-the-art tools for data processing, natural language understanding, 
                  and clinical protocol analysis to ensure accurate and relevant matches.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  Intelligent patient-trial matching based on medical history and eligibility criteria
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  Real-time analytics and performance monitoring
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  Automated summary generation for matched trials
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  Protocol optimization recommendations
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
