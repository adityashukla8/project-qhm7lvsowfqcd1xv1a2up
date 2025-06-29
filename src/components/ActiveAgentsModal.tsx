import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Bot } from 'lucide-react'

interface ActiveAgentsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ActiveAgentsModal({ isOpen, onClose }: ActiveAgentsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            Active Agents (5)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Agent 1 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">Agent 1: Patient Eligibility Match</h3>
            <p className="text-sm text-gray-600 mb-2">Compares inclusion/exclusion criteria with patient profile</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">Output:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Match / No Match</li>
                <li>• Reason for match status</li>
                <li>• Required changes (if any) to qualify</li>
              </ul>
            </div>
          </div>

          {/* Agent 2 */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">Agent 2: Tavily Web Search Agent</h3>
            <p className="text-sm text-gray-600 mb-2">Enriches matched trials with:</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sponsor details</li>
                <li>• Enrollment info</li>
                <li>• Known side effects</li>
                <li>• Statistical plan</li>
                <li>• Sample size</li>
                <li>• Monitoring requirements</li>
              </ul>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">Agent 3: Age Gap Optimization</h3>
            <p className="text-sm text-gray-600 mb-2">Simulates impact of altering age eligibility range</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">Computes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• % increase in eligible patients</li>
                <li>• Missed due to lower/upper limits</li>
                <li>• Revised age range recommendation</li>
                <li>• Clinical justification</li>
              </ul>
            </div>
          </div>

          {/* Agent 4 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">Agent 4: Biomarker Threshold Agent</h3>
            <p className="text-sm text-gray-600 mb-2">Evaluates impact of relaxing biomarker criteria</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">Computes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Estimated gain</li>
                <li>• Suggested new inclusion</li>
                <li>• Clinical rationale</li>
              </ul>
            </div>
          </div>

          {/* Agent 5 */}
          <div className="border-l-4 border-teal-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-2">Agent 5: Supervisor Summary Agent</h3>
            <p className="text-sm text-gray-600 mb-2">Synthesizes outputs from Age Gap and Biomarker agents</p>
            <p className="text-sm text-gray-600 mb-2">Compares against current protocol</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">Generates a unified optimization report:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Summary impact</li>
                <li>• Clinical Recommendations</li>
                <li>• Quantitative Estimates</li>
                <li>• Explanation</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}