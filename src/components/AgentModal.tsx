import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Brain, Search, Workflow } from "lucide-react"

interface AgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgentModal({ open, onOpenChange }: AgentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
            Agents in Action
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Eligibility Matcher Agent */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">🔎 Eligibility Matcher (Gemini)</h3>
                <Badge variant="secondary" className="mt-1">AI Agent</Badge>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Compares a patient's clinical profile (age, diagnosis, biomarkers, treatment history, etc.) 
              against trial eligibility criteria. Returns match status (e.g. Match / No Match), explanation, 
              and unmet requirements.
            </p>
          </div>

          {/* Trial Enricher Agent */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">🌐 Trial Enricher (Tavily)</h3>
                <Badge variant="secondary" className="mt-1">AI Agent</Badge>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Once a trial is matched, this agent automatically gathers additional insights from numerous 
              trusted web sources. It populates fields such as side effects, sponsor info, monitoring 
              frequency, statistical plan, patient experiences, and many more with citations.
            </p>
          </div>

          {/* Agent Orchestration */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Workflow className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Agent Orchestration</h3>
                <Badge variant="outline" className="mt-1">Workflow</Badge>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Langgraph conditional workflow manages calling agents and tools as necessary, 
              triggering Tavily agent for all matched profiles.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}