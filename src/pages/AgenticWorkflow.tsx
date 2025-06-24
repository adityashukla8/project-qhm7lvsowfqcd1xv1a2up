import { useState, useEffect } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Search, Play, RefreshCw, Activity, Clock, CheckCircle, XCircle, User } from "lucide-react"
import { Patient, WorkflowExecution } from '@/entities'
import { runAgenticWorkflow, getWorkflowStatus } from "@/functions"

interface PatientData extends Patient {
  id: string
}

interface WorkflowData extends WorkflowExecution {
  id: string
}

const AgenticWorkflow = () => {
  const [patients, setPatients] = useState<PatientData[]>([])
  const [workflows, setWorkflows] = useState<WorkflowData[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [workflowType, setWorkflowType] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [patientsData, workflowsData] = await Promise.all([
        Patient.list(),
        WorkflowExecution.list('-created_at', 50)
      ])
      setPatients(patientsData)
      setWorkflows(workflowsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRunWorkflow = async () => {
    if (!selectedPatient || !workflowType) {
      toast({
        title: "Missing Information",
        description: "Please select a patient and workflow type",
        variant: "destructive"
      })
      return
    }

    setIsRunning(true)
    try {
      const result = await runAgenticWorkflow({
        patient_id: selectedPatient,
        workflow_type: workflowType
      })

      if (result.success) {
        toast({
          title: "Workflow Started",
          description: "Agentic workflow has been initiated successfully",
        })
        
        // Create workflow execution record
        await WorkflowExecution.create({
          workflow_id: result.workflow_id,
          patient_id: selectedPatient,
          workflow_type: workflowType,
          status: 'running',
          progress: 0,
          current_step: 'Initializing workflow',
          started_at: new Date().toISOString()
        })

        // Refresh data
        await fetchData()
        
        // Reset form
        setSelectedPatient('')
        setWorkflowType('')
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Workflow error:', error)
      toast({
        title: "Workflow Failed",
        description: error.message || "Failed to start workflow",
        variant: "destructive"
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleRefreshStatus = async (workflowId: string) => {
    try {
      const result = await getWorkflowStatus({ workflow_id: workflowId })
      
      if (result.success) {
        // Update workflow status in database
        const workflow = workflows.find(w => w.workflow_id === workflowId)
        if (workflow) {
          await WorkflowExecution.update(workflow.id, {
            status: result.status,
            progress: result.progress,
            current_step: result.current_step,
            results: result.results ? JSON.stringify(result.results) : undefined,
            completed_at: result.status === 'completed' ? new Date().toISOString() : undefined
          })
          
          await fetchData()
        }
      }
    } catch (error) {
      console.error('Status refresh error:', error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh workflow status",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'running': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'running': return <Activity className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="gradient-bg-medical">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Agentic Workflow</h1>
                <p className="text-blue-100 text-base sm:text-lg">Manage AI-powered patient analysis workflows</p>
              </div>
            </div>
          </header>
        </div>
        <main className="p-4 sm:p-8 -mt-4 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="gradient-bg-medical">
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Agentic Workflow</h1>
              <p className="text-blue-100 text-base sm:text-lg">Manage AI-powered patient analysis workflows</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-8 animate-slide-up">
          {/* Start New Workflow */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Start New Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient-search" className="text-sm font-semibold text-gray-700">Select Patient</Label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="patient-search"
                      placeholder="Search patients..."
                      className="pl-10 h-12 border-0 bg-gray-50 rounded-xl"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {searchTerm && (
                    <div className="max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                            selectedPatient === patient.patient_id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            setSelectedPatient(patient.patient_id)
                            setSearchTerm('')
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{patient.patient_name}</p>
                              <p className="text-xs text-gray-500">ID: {patient.patient_id}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedPatient && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Selected: {patients.find(p => p.patient_id === selectedPatient)?.patient_name}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workflow-type" className="text-sm font-semibold text-gray-700">Workflow Type</Label>
                  <Select value={workflowType} onValueChange={setWorkflowType}>
                    <SelectTrigger className="h-12 border-0 bg-gray-50 rounded-xl">
                      <SelectValue placeholder="Select workflow type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial_matching">Trial Matching</SelectItem>
                      <SelectItem value="enrichment">Data Enrichment</SelectItem>
                      <SelectItem value="analysis">Patient Analysis</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-xl px-6 h-12 shadow-lg w-full"
                    onClick={handleRunWorkflow}
                    disabled={isRunning || !selectedPatient || !workflowType}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Starting...' : 'Start Workflow'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow History */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="text-lg sm:text-xl">Workflow History</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              {workflows.length > 0 ? (
                <div className="space-y-4">
                  {workflows.map((workflow, index) => (
                    <div key={workflow.id} className="border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={`${getStatusColor(workflow.status || '')} border font-medium px-3 py-1 flex items-center gap-2`}>
                              {getStatusIcon(workflow.status || '')}
                              {workflow.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {workflow.workflow_type?.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Patient ID</span>
                              <p className="font-medium text-gray-900">{workflow.patient_id}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Workflow ID</span>
                              <p className="font-mono text-sm text-gray-900">{workflow.workflow_id}</p>
                            </div>
                          </div>

                          {workflow.status === 'running' && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                <span className="text-sm text-gray-500">{workflow.progress || 0}%</span>
                              </div>
                              <Progress value={workflow.progress || 0} className="h-2" />
                              {workflow.current_step && (
                                <p className="text-sm text-gray-600 mt-2">{workflow.current_step}</p>
                              )}
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            Started: {workflow.started_at ? new Date(workflow.started_at).toLocaleString() : 'Unknown'}
                            {workflow.completed_at && (
                              <span className="ml-4">
                                Completed: {new Date(workflow.completed_at).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefreshStatus(workflow.workflow_id)}
                            className="rounded-xl"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
                  <p className="text-gray-500">Start your first agentic workflow to see it here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AgenticWorkflow