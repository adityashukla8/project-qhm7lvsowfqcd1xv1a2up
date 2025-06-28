import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Bot, Zap, Target, Search, Database, Brain, GitBranch, BarChart3, Shield, Globe } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-blue-600">
        <header className="px-6 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-2xl font-bold text-white">About Criteria-AI</h1>
              <p className="text-blue-100">AI-Driven Clinical Trial Matching & Protocol Optimization System</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-6 max-w-6xl mx-auto -mt-4 relative z-10">
        <div className="space-y-6 animate-fade-in">
          {/* Platform Overview */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="w-6 h-6 text-blue-600" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Identifying suitable clinical trials for patients and optimizing trial protocols to enhance recruitment are both critical and highly complex challenges in real-world clinical research. Traditional systems rely on rigid rules, leading to:
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-red-800">Low match rates due to narrow eligibility criteria.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-red-800">Poor protocol design, overlooking population-specific characteristics.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-red-800">High dropout rates and delayed enrollment timelines.</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                <strong>Criteria-AI addresses these challenges head-on.</strong> It combines clinical logic, generative AI, and patient data analytics to streamline two key workflows:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Patient-Trial Matching
                  </h4>
                  <p className="text-blue-800 text-sm">Accurately evaluates patient eligibility against real-world clinical trial criteria.</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Protocol Optimization
                  </h4>
                  <p className="text-green-800 text-sm">Analyses and suggests evidence-based revisions to improve inclusivity and trial feasibility.</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Built on a robust multi-agent architecture, Criteria-AI enables real-time, explainable decision support for clinical researchers and study designers.
              </p>
            </CardContent>
          </Card>

          {/* Multi-Agent System */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bot className="w-6 h-6 text-green-600" />
                Multi-Agent, Multi-Tool System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-6">
                Criteria-AI is powered by a distributed intelligence layer — a multi-agent architecture orchestrated using tools like LangGraph, Gemini (LLM), AppWrite, Tavily, and Superdev.
              </p>

              {/* Clinical Trial Matching Workflow */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                  1️⃣ Clinical Trial Matching Workflow
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      Tools:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Search className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">Tavily</span>
                          <p className="text-sm text-gray-600">Web searching to find Clinical Trial details from various forums, .gov .org sites, research sites etc</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Database className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">AppWrite DB</span>
                          <p className="text-sm text-gray-600">Fetch structured patient profiles (age, gender, biomarkers, diagnosis, ECOG, etc.)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">ClinicalTrials.gov</span>
                          <p className="text-sm text-gray-600">Pull all matching real-world trials for the condition</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      Agents:
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <span className="font-medium text-purple-900">Eligibility Match Agent</span>
                        <p className="text-sm text-purple-700">Uses Gemini to match detailed I/E criteria with patient profile</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="font-medium text-blue-900">Web Search Agent</span>
                        <p className="text-sm text-blue-700">Leverages Tavily to have 60+ citations per trial + Gemini to extract trial detail report (side effects, enrollment targets, safety monitoring, etc.)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Outcome:</h4>
                  <p className="text-green-800 text-sm">Structured match/no-match report with clinical rationale, stored in AppWrite DB.</p>
                </div>
              </div>

              {/* Protocol Optimization Workflow */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  2️⃣ Protocol Optimization Workflow
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      Tools:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">ClinicalTrials.gov</span>
                          <p className="text-sm text-gray-600">Fetch original trial protocol data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Database className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900">AppWrite</span>
                          <p className="text-sm text-gray-600">Access patient cohort data</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      Agents:
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <span className="font-medium text-orange-900">Age Gap Optimization Agent</span>
                        <p className="text-sm text-orange-700">Suggests revised age brackets to maximize eligibility</p>
                      </div>
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                        <span className="font-medium text-teal-900">Biomarker Threshold Agent</span>
                        <p className="text-sm text-teal-700">Recommends inclusive biomarker criteria</p>
                      </div>
                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <span className="font-medium text-indigo-900">Supervisor Agent</span>
                        <p className="text-sm text-indigo-700">Synthesizes insights into a unified optimization report</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="w-6 h-6 text-purple-600" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">LLM-driven Eligibility Matching</h4>
                      <p className="text-sm text-gray-600">Interprets unstructured trial protocols and compares them against structured patient data for transparent decision-making.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Search className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Structured Trial Search & Summarization</h4>
                      <p className="text-sm text-gray-600">Combines Tavily's real-time search with Gemini's summarization to deliver detailed trial briefs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Protocol Optimization Report</h4>
                      <p className="text-sm text-gray-600">Quantifies patient eligibility under current vs. revised criteria — e.g., "Eligibility increased by 8% when upper age bound raised to 75."</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <GitBranch className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Multi-agent Workflow Design</h4>
                      <p className="text-sm text-gray-600">Each analytical function is modular and agent-driven — e.g., eligibility match, biomarker analysis, summary generation.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Database className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">AppWrite Integration</h4>
                      <p className="text-sm text-gray-600">Full write/read capabilities for Patient Info, Match Reports, Trial Details, and Optimization Reports.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Future Extensions</h4>
                      <p className="text-sm text-gray-600">Optimization agents for: ECOG score gaps, treatment washout windows, geographic constraints. Leverage Tavily to power better Protocol Optimization by searching evidence with historical, similar trials.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default About