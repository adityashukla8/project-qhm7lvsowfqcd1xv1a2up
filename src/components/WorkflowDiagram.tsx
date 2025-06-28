import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Database, 
  Search, 
  Brain, 
  CheckCircle, 
  XCircle, 
  Globe, 
  ArrowDown, 
  ArrowRight,
  Zap,
  Bot,
  ExternalLink
} from "lucide-react"

const WorkflowDiagram = () => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null)

  const steps = [
    {
      id: 1,
      title: "Start: User enters Patient ID",
      type: "user",
      icon: User,
      description: "User inputs patient identifier to begin the matching process",
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      id: 2,
      title: "Fetch Patient Info from AppWrite",
      type: "database",
      icon: Database,
      description: "Query AppWrite database for patient profile based on ID",
      details: "Retrieves patient demographics, medical history, biomarkers, and treatment history",
      color: "bg-purple-100 border-purple-300 text-purple-800"
    },
    {
      id: 3,
      title: "'Match Clinical Trials' Button Click",
      type: "action",
      icon: Search,
      description: "User initiates the clinical trial matching process",
      color: "bg-green-100 border-green-300 text-green-800"
    },
    {
      id: 4,
      title: "🔧 Clinical Trials Lookup Tool",
      type: "tool",
      icon: ExternalLink,
      description: "Tool searches https://clinicaltrials.gov/ using Patient Condition/Diagnosis",
      details: "Automated search across clinical trials database using patient's specific medical condition",
      color: "bg-orange-100 border-orange-300 text-orange-800",
      isHighlighted: true
    },
    {
      id: 5,
      title: "Return List of Related Trials",
      type: "data",
      icon: Search,
      description: "System returns comprehensive list of potentially matching clinical trials",
      color: "bg-gray-100 border-gray-300 text-gray-800"
    },
    {
      id: 6,
      title: "🤖 AI Agent: Gemini",
      type: "ai",
      icon: Brain,
      description: "Compare Patient Profile with trial eligibility criteria",
      details: "AI analyzes patient data against each trial's inclusion/exclusion criteria",
      output: "For each trial → Match status (Match / Partial / No Match), Reason, and Match Requirements",
      color: "bg-emerald-100 border-emerald-300 text-emerald-800",
      isHighlighted: true
    },
    {
      id: 7,
      title: "Decision: Trial Matched?",
      type: "decision",
      icon: CheckCircle,
      description: "System evaluates if trials meet matching criteria",
      branches: ["Yes → Continue to enrichment", "No → Skip enrichment"],
      color: "bg-yellow-100 border-yellow-300 text-yellow-800"
    },
    {
      id: 8,
      title: "🤖 AI Agent: Tavily - Deep Trial Insights",
      type: "ai",
      icon: Bot,
      description: "Crawl external sources for each matched trial",
      details: "Advanced AI agent fetches comprehensive trial information from multiple authoritative sources",
      sources: [
        { field: "official_title", source: "clinicaltrials.gov" },
        { field: "sponsor_info", source: "clinicaltrials.gov" },
        { field: "location_and_site_details", source: "clinicaltrials.gov" },
        { field: "enrollment_info", source: "clinicaltrials.gov" },
        { field: "known_side_effects", source: "pubmed, nature" },
        { field: "patient_experiences", source: "reddit, cancerforums" },
        { field: "external_notes", source: "mdanderson, stanford, nejm" },
        { field: "objective_summary", source: "clinicaltrials.gov" },
        { field: "dsmc_presence", source: "clinicaltrials.gov" },
        { field: "statistical_plan", source: "clinicaltrials.gov" },
        { field: "sample_size", source: "clinicaltrials.gov" },
        { field: "intervention_arms", source: "clinicaltrials.gov" },
        { field: "sponsor_contact", source: "clinicaltrials.gov" },
        { field: "sites", source: ".edu / .org domains" },
        { field: "monitoring_frequency", source: "clinicaltrials.gov" },
        { field: "safety_documents", source: "pubmed, nejm" },
        { field: "patient_faq_summary", source: "reddit, cancerforums" },
        { field: "pre_req_for_participation", source: "clinicaltrials.gov, pubmed" }
      ],
      color: "bg-indigo-100 border-indigo-300 text-indigo-800",
      isHighlighted: true
    },
    {
      id: 9,
      title: "End: Display Results",
      type: "result",
      icon: CheckCircle,
      description: "Show Clinical Trials fetched with Match results and criteria",
      details: "Present comprehensive trial information with AI-generated matching analysis",
      color: "bg-green-100 border-green-300 text-green-800"
    }
  ]

  const getStepIcon = (step: any) => {
    const IconComponent = step.icon
    return <IconComponent className="w-5 h-5" />
  }

  const renderStepCard = (step: any, index: number) => {
    const isSelected = selectedStep === step.id
    const isHighlighted = step.isHighlighted

    return (
      <div key={step.id} className="relative">
        <Card 
          className={`
            cursor-pointer transition-all duration-300 hover:shadow-lg touch-manipulation
            ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
            ${isHighlighted ? 'ring-2 ring-amber-400 shadow-amber-100' : ''}
          `}
          onClick={() => setSelectedStep(isSelected ? null : step.id)}
        >
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${step.color}`}>
                {getStepIcon(step)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm sm:text-base font-semibold flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="break-words">{step.title}</span>
                  {isHighlighted && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs w-fit">
                      <Zap className="w-3 h-3 mr-1" />
                      AI/Tool
                    </Badge>
                  )}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          
          {isSelected && (
            <CardContent className="pt-0 p-4 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              
              {step.details && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-700 leading-relaxed">{step.details}</p>
                </div>
              )}
              
              {step.output && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-blue-900 mb-1">Output:</p>
                  <p className="text-xs text-blue-700 leading-relaxed">{step.output}</p>
                </div>
              )}
              
              {step.branches && (
                <div className="space-y-2">
                  {step.branches.map((branch: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      {branch.includes('Yes') ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-xs text-gray-700 leading-relaxed">{branch}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {step.sources && (
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-indigo-900 mb-2">Sources Crawled:</p>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                    {step.sources.map((source: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs">
                        <span className="font-medium text-indigo-800 break-words">{source.field}:</span>
                        <span className="text-indigo-600 break-words">{source.source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
        
        {index < steps.length - 1 && (
          <div className="flex justify-center my-4">
            <ArrowDown className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6 px-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Clinical Trial Matching Workflow</h3>
        <p className="text-sm text-gray-600 mb-3">Tap on any step to see detailed information</p>
        <div className="flex justify-center">
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            <Zap className="w-3 h-3 mr-1" />
            AI Agents & Tools Highlighted
          </Badge>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto pr-2 px-2">
        {steps.map((step, index) => renderStepCard(step, index))}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mx-2">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">AI-Powered Intelligence</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              This workflow leverages advanced AI agents (Gemini for matching, Tavily for enrichment) 
              and automated tools to provide comprehensive clinical trial analysis from multiple authoritative sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowDiagram