import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Workflow, ExternalLink } from "lucide-react"

const WorkflowImageSection = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleImageClick = () => {
    window.open('https://github.com/adityashukla8/clinicaltrials-multiagent/blob/master/assets/Clinical%20Trial%20Matching%20Workflow.png', '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Workflow className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Clinical Trial Matching Workflow
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-700 hover:bg-indigo-100"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show Workflow
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <div 
              className="cursor-pointer group relative inline-block"
              onClick={handleImageClick}
            >
              <img 
                src="https://github.com/adityashukla8/clinicaltrials-multiagent/blob/master/assets/Clinical%20Trial%20Matching%20Workflow.png?raw=true"
                alt="Clinical Trial Matching Workflow"
                className="w-full h-auto rounded-lg shadow-md border border-gray-200 transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-lg"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-3 shadow-lg">
                  <ExternalLink className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Complete workflow diagram showing the clinical trial matching process
              <br />
              <span className="text-indigo-600 font-medium cursor-pointer hover:underline" onClick={handleImageClick}>
                Click to view source repository
              </span>
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default WorkflowImageSection