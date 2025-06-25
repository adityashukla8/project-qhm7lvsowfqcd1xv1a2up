import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react"
import WorkflowDiagram from './WorkflowDiagram'

const WorkflowModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-sm"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          How It Works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Clinical Trial Matching Process
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <WorkflowDiagram />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WorkflowModal