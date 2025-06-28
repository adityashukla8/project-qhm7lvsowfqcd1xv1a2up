import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import WorkflowDiagram from './WorkflowDiagram'

const WorkflowModal = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] touch-manipulation"
        >
          <Info className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">How it Works</span>
          <span className="sm:hidden">Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 sm:p-6 border-b">
          <DialogTitle className="text-lg sm:text-xl">Clinical Trial Matching Workflow</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4 sm:p-6">
          <WorkflowDiagram />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WorkflowModal