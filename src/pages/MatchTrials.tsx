import { useState, useEffect } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Users, FileText, Brain, Globe, Info } from "lucide-react"
import { fetchPatients, matchTrials, trialInfo } from '@/functions'
import EligibilityText from '@/components/EligibilityText'
import { useToast } from "@/hooks/use-toast"
import WorkflowModal from '@/components/WorkflowModal'

interface Patient {
  id: string
  patient_id: string
  patient_name: string
  condition: string
  age: number
  gender: string[]
  country: string
  status: string
  matched: boolean
  matched_trials_count: number
}

interface MatchResult {
  patient_id: string
  patient_name: string
  matched_trials: Array<{
    trial_id: string
    title: string
    phase: string
    confidence_score: number
    match_criteria: string
    reason: string
  }>
}

const MatchTrials = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [showWorkflow, setShowWorkflow] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await fetchPatients({})
      if (response.success && response.patients) {
        setPatients(Array.isArray(response.patients) ? response.patients : [])
      }
    } catch (error) {
      console.error('Error loading patients:', error)
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMatchTrials = async () => {
    if (!selectedPatient) return

    try {
      setMatching(true)
      const response = await matchTrials({ patient_id: selectedPatient.patient_id })
      
      if (response.success && response.matches) {
        setMatchResults([response.matches])
        toast({
          title: "Success",
          description: `Found ${response.matches.matched_trials.length} matching trials for ${selectedPatient.patient_name}`,
        })
      } else {
        toast({
          title: "No matches",
          description: response.error || "No matching trials found",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error matching trials:', error)
      toast({
        title: "Error",
        description: "Failed to match trials",
        variant: "destructive",
      })
    } finally {
      setMatching(false)
    }
  }

  const handleGetTrialInfo = async (trialId: string) => {
    try {
      const response = await trialInfo({ trial_id: trialId })
      if (response.success && response.trial_info) {
        toast({
          title: "Trial Information",
          description: "Trial details retrieved successfully",
        })
      }
    } catch (error) {
      console.error('Error getting trial info:', error)
      toast({
        title: "Error",
        description: "Failed to get trial information",
        variant: "destructive",
      })
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-blue-600">
        <header className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20 p-2" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Match Clinical Trials</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1">Find suitable trials for patients</p>
            </div>
            <Button
              onClick={() => setShowWorkflow(true)}
              variant="secondary"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              How it works
            </Button>
          </div>
        </header>
      </div>

      <main className="p-4 sm:p-6 lg:p-8 -mt-2 sm:-mt-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Selection */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Select Patient
              </CardTitle>
              <CardDescription>
                Choose a patient to find matching clinical trials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedPatient?.id === patient.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{patient.patient_name}</h3>
                          <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
                          <p className="text-sm text-gray-600">{patient.condition}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={patient.status === 'processed' ? 'default' : 'secondary'}>
                            {patient.status}
                          </Badge>
                          {patient.matched && (
                            <p className="text-xs text-green-600 mt-1">
                              {patient.matched_trials_count} matches
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPatient && (
                <Button
                  onClick={handleMatchTrials}
                  disabled={matching}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {matching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Matching Trials...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Match Trials
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Match Results */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Matching Results
              </CardTitle>
              <CardDescription>
                Clinical trials matched for the selected patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No matches yet. Select a patient and click "Match Trials" to see results.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchResults.map((result, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">{result.patient_name}</h3>
                        <Badge variant="outline">
                          {result.matched_trials.length} trials found
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {result.matched_trials.map((trial, trialIndex) => (
                          <div key={trialIndex} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-blue-600">{trial.title}</h4>
                              <Badge variant="secondary">{trial.phase}</Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">ID: {trial.trial_id}</p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">Confidence:</span>
                              <Badge variant={trial.confidence_score >= 0.8 ? 'default' : 'secondary'}>
                                {(trial.confidence_score * 100).toFixed(0)}%
                              </Badge>
                            </div>
                            
                            <EligibilityText text={trial.reason} />
                            
                            <Button
                              onClick={() => handleGetTrialInfo(trial.trial_id)}
                              variant="outline"
                              size="sm"
                              className="mt-3"
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              Get Trial Info
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <WorkflowModal open={showWorkflow} onOpenChange={setShowWorkflow} />
    </div>
  )
}

export default MatchTrials