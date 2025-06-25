import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Database, Globe, Brain, TestTube } from "lucide-react"

interface ToolsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ToolsModal({ open, onOpenChange }: ToolsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
            Available Tools
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* ClinicalTrials.gov Look-Up */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TestTube className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ClinicalTrials.gov Look-Up</h3>
                <Badge variant="secondary" className="mt-1">Registry Tool</Badge>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The foundational registry from which trials are fetched based on patient diagnosis and conditions.
            </p>
          </div>

          {/* Gemini API */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gemini API (LLM)</h3>
                <Badge variant="secondary" className="mt-1">AI Tool</Badge>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Performs structured reasoning to assess trial eligibility criteria in natural language.
            </p>
          </div>

          {/* Tavily Web Search API */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tavily Web Search API</h3>
                <Badge variant="secondary" className="mt-1">Search Tool</Badge>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Conducts focused web scraping to collect trial-related information from medical research sites, 
              academic institutions, and patient forums.
            </p>
          </div>

          {/* AppWrite Database */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AppWrite Database</h3>
                <Badge variant="secondary" className="mt-1">Storage Tool</Badge>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              All data (patients, trials, match results, enriched summaries) retrieve and write data 
              securely to/from AppWrite for real-time metrics and analysis.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}