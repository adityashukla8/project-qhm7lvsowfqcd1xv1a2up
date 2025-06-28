import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Bot, Zap, Search, Database, Brain, Target, TrendingUp, FileText, Settings, Globe } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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
      
      <main className="p-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Identifying suitable clinical trials for patients and optimizing trial protocols to enhance recruitment are both critical and highly complex challenges in real-world clinical research. Traditional systems rely on rigid rules, leading to:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    Low match rates due to narrow eligibility criteria.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    Poor protocol design, overlooking population-specific characteristics.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    High dropout rates and delayed enrollment timelines.
                  </li>
                </ul>
                <p>
                  Criteria-AI addresses these challenges head-on. It combines clinical logic, generative AI, and patient data analytics to streamline two key workflows:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Patient-Trial Matching</h4>
                    <p className="text-sm text-blue-800">Accurately evaluates patient eligibility against real-world clinical trial criteria.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Protocol Optimization</h4>
                    <p className="text-sm text-green-800">Analyses and suggests evidence-based revisions to improve inclusivity and trial feasibility.</p>
                  </div>
                </div>
                <p>
                  Built on a robust multi-agent architecture, Criteria-AI enables real-time, explainable decision support for clinical researchers and study designers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-600" />
                Multi-Agent, Multi-Tool System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Criteria-AI is powered by a distributed intelligence layer — a multi-agent architecture orchestrated using tools like LangGraph, Gemini (LLM), AppWrite, Tavily, and Superdev.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clinical Trial Matching Workflow */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Clinical Trial Matching Workflow
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Tools:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Search className="w-4 h-4 mt-0.5 text-blue-500" />
                          <span><strong>Tavily</strong> for web searching to find Clinical Trial details from various forums, .gov .org sites, research sites etc</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Database className="w-4 h-4 mt-0.5 text-green-500" />
                          <span><strong>AppWrite DB:</strong> Fetch structured patient profiles (age, gender, biomarkers, diagnosis, ECOG, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Globe className="w-4 h-4 mt-0.5 text-purple-500" />
                          <span><strong>ClinicalTrials.gov:</strong> Pull all matching real-world trials for the condition.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Agents:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Brain className="w-4 h-4 mt-0.5 text-blue-500" />
                          <span><strong>Eligibility Match Agent:</strong> Uses Gemini to match detailed I/E criteria with patient profile.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Search className="w-4 h-4 mt-0.5 text-green-500" />
                          <span><strong>Web Search Agent:</strong> Leverages Tavily to have 60+ citations per trial + Gemini to extract trial detail report (side effects, enrollment targets, safety monitoring, etc.)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Outcome:</h4>
                      <p className="text-sm text-gray-600">
                        Structured match/no-match report with clinical rationale, stored in AppWrite DB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Protocol Optimization Workflow */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    Protocol Optimization Workflow
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Tools:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Globe className="w-4 h-4 mt-0.5 text-purple-500" />
                          <span><strong>ClinicalTrials.gov:</strong> Fetch original trial protocol data.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Database className="w-4 h-4 mt-0.5 text-green-500" />
                          <span><strong>AppWrite:</strong> Access patient cohort data.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Agents:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Users className="w-4 h-4 mt-0.5 text-blue-500" />
                          <span><strong>Age Gap Optimization Agent:</strong> Suggests revised age brackets to maximize eligibility.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 mt-0.5 text-green-500" />
                          <span><strong>Biomarker Threshold Agent:</strong> Recommends inclusive biomarker criteria.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Brain className="w-4 h-4 mt-0.5 text-purple-500" />
                          <span><strong>Supervisor Agent:</strong> Synthesizes insights into a unified optimization report.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
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
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Protocol Optimization Report</h4>
                      <p className="text-sm text-gray-600">Quantifies patient eligibility under current vs. revised criteria — e.g., "Eligibility increased by 8% when upper age bound raised to 75."</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Multi-agent Workflow Design</h4>
                      <p className="text-sm text-gray-600">Each analytical function is modular and agent-driven — e.g., eligibility match, biomarker analysis, summary generation.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Database className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">AppWrite Integration</h4>
                      <p className="text-sm text-gray-600">Full write/read capabilities for Patient Info, Match Reports, Trial Details, and Optimization Reports.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Future Extensions (already planned):</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Optimization agents for: ECOG score gaps, treatment washout windows, geographic constraints.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Leverage Tavily to power better Protocol Optimization by searching evidence with historical, similar trials.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default About