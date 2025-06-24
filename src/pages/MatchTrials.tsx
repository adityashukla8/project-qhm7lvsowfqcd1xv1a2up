import { useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, ExternalLink, Calendar, User, Activity, Zap } from "lucide-react"
import { useAppWriteData } from '@/hooks/useAppWriteData'
import { Link } from 'react-router-dom'
import { runAgenticWorkflow } from "@/functions"
import { useToast } from "@/hooks/use-toast"

interface TrialDocument {
  $id: string;
  trial_id: string;
  title: string;
  phase?: string;
  condition: string;
  status?: string;
  location: string;
  matched_patients_count?: number;
}

interface PatientDocument {
  $id: string;
  patient_id: string;
  patient_name: string;
  condition: string;
  age: number;
  gender?: string[];
  country: string;
  status?: string;
  matched?: boolean;
  matched_trials_count?: number;
}

interface MatchDocument {
  $id: string;
  patient_id: string;
  trial_id: string;
  match_criteria?: string;
  reason?: string;
  confidence_score?: number;
}

const MatchTrials = () => {
  const [patientId, setPatientId] = useState('')
  const [patientData, setPatientData] = useState<PatientDocument | null>(null)
  const [matchingResults, setMatchingResults] = useState<TrialDocument[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isFetchingPatient, setIsFetchingPatient] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false)
  const { toast } = useToast()

  const {
    data: allTrials,
    getDocument: getTrialDocument
  } = useAppWriteData<TrialDocument>({
    collection: 'trial_info',
    autoFetch: false
  });

  const {
    getDocument: getPatientDocument
  } = useAppWriteData<PatientDocument>({
    collection: 'patient_info_collection',
    autoFetch: false
  });

  const {
    data: matchData
  } = useAppWriteData<MatchDocument>({
    collection: 'match_info',
    filters: patientData ? { patient_id: patientData.patient_id } : undefined,
    autoFetch: !!patientData
  });

  const handleFetchPatient = async () => {
    if (!patientId.trim()) {
      toast({
        title: "Missing Patient ID",
        description: "Please enter a patient ID",
        variant: "destructive"
      })
      return
    }

    setIsFetchingPatient(true)
    try {
      // Search for patient by patient_id field
      const result = await fetch('/api/functions/appwrite-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'list',
          collection: 'patient_info_collection',
          filters: { patient_id: patientId.trim() }
        })
      });

      const response = await result.json();
      
      if (response.success && response.data.length > 0) {
        setPatientData(response.data[0]);
        toast({
          title: "Patient Found",
          description: `Loaded data for ${response.data[0].patient_name}`,
        })
      } else {
        toast({
          title: "Patient Not Found",
          description: "No patient found with the provided ID",
          variant: "destructive"
        })
        setPatientData(null)
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
      toast({
        title: "Error",
        description: "Failed to fetch patient data",
        variant: "destructive"
      })
    } finally {
      setIsFetchingPatient(false)
    }
  }

  const handleFindTrials = async () => {
    if (!patientData) {
      toast({
        title: "No Patient Data",
        description: "Please fetch patient data first",
        variant: "destructive"
      })
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    
    try {
      // Get matching trial IDs from match_info collection
      const matchTrialIds = matchData.map(match => match.trial_id);
      
      if (matchTrialIds.length === 0) {
        setMatchingResults([])
        toast({
          title: "No Matches Found",
          description: "No trial matches found for this patient",
        })
        return
      }

      // Fetch trial details for matched trials
      const trialPromises = matchTrialIds.map(async (trialId) => {
        try {
          const result = await fetch('/api/functions/appwrite-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'list',
              collection: 'trial_info',
              filters: { trial_id: trialId }
            })
          });
          const response = await result.json();
          return response.success && response.data.length > 0 ? response.data[0] : null;
        } catch (error) {
          console.error(`Error fetching trial ${trialId}:`, error);
          return null;
        }
      });

      const trials = await Promise.all(trialPromises);
      const validTrials = trials.filter(trial => trial !== null);
      
      setMatchingResults(validTrials);
      
      toast({
        title: "Trials Found",
        description: `Found ${validTrials.length} matching trials`,
      })
    } catch (error) {
      console.error('Error finding trials:', error)
      toast({
        title: "Search Failed",
        description: "Failed to find matching trials",
        variant: "destructive"
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleRunAgenticWorkflow = async () => {
    if (!patientData) {
      toast({
        title: "No Patient Selected",
        description: "Please fetch patient data first",
        variant: "destructive"
      })
      return
    }

    setIsRunningWorkflow(true)
    try {
      const result = await runAgenticWorkflow({
        patient_id: patientData.patient_id,
        workflow_type: 'trial_matching'
      })

      if (result.success) {
        toast({
          title: "Agentic Workflow Started",
          description: "AI agents are now analyzing the patient for optimal trial matches",
        })
        
        // Optionally refresh the patient data after workflow
        setTimeout(async () => {
          await handleFetchPatient()
        }, 2000)
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Agentic workflow error:', error)
      toast({
        title: "Workflow Failed",
        description: error.message || "Failed to start agentic workflow",
        variant: "destructive"
      })
    } finally {
      setIsRunningWorkflow(false)
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Phase 1': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Phase 2': return 'bg-green-100 text-green-700 border-green-200'
      case 'Phase 3': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Phase 4': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="gradient-bg-medical">
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Match Trials</h1>
              <p className="text-blue-100 text-base sm:text-lg">Find clinical trials for patients</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-6xl mx-auto">
        <div className="space-y-6 sm:space-y-8 animate-slide-up">
          {/* Patient Search */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Patient Search
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="patient-id" className="text-sm font-semibold text-gray-700 mb-2 block">Patient ID</Label>
                  <Input
                    id="patient-id"
                    placeholder="Enter patient ID (e.g., P001)"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="h-10 sm:h-12 border-0 bg-gray-50 rounded-xl"
                    onKeyPress={(e) => e.key === 'Enter' && handleFetchPatient()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-xl px-6 h-10 sm:h-12 shadow-lg w-full sm:w-auto"
                    onClick={handleFetchPatient}
                    disabled={isFetchingPatient}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isFetchingPatient ? 'Searching...' : 'Find Patient'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Details */}
          {patientData && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Patient Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Name</span>
                    <p className="font-semibold text-gray-900">{patientData.patient_name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Age</span>
                    <p className="font-semibold text-gray-900">{patientData.age}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Condition</span>
                    <p className="font-semibold text-gray-900">{patientData.condition}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Country</span>
                    <p className="font-semibold text-gray-900">{patientData.country}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-xl px-6 h-10 sm:h-12 shadow-lg"
                    onClick={handleFindTrials}
                    disabled={isSearching}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {isSearching ? 'Finding Trials...' : 'Find Matching Trials'}
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-xl px-6 h-10 sm:h-12 shadow-lg"
                    onClick={handleRunAgenticWorkflow}
                    disabled={isRunningWorkflow}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isRunningWorkflow ? 'Starting AI Analysis...' : 'Run AI Workflow'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Matching Results */}
          {hasSearched && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <CardTitle className="text-lg sm:text-xl">
                  Matching Results ({matchingResults.length} trials found)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                {matchingResults.length > 0 ? (
                  <div className="space-y-4">
                    {matchingResults.map((trial, index) => (
                      <Card key={trial.$id} className="border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{trial.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {trial.phase && (
                                <Badge className={`${getPhaseColor(trial.phase)} border font-medium px-3 py-1`}>
                                  {trial.phase}
                                </Badge>
                              )}
                              {trial.status && (
                                <Badge className={`${getStatusColor(trial.status)} border font-medium px-3 py-1`}>
                                  {trial.status}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-600">{trial.condition}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                <span className="text-gray-600">{trial.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-600">{trial.matched_patients_count || 0} patients</span>
                              </div>
                            </div>
                          </div>
                          <Link to={`/trials/${trial.$id}`}>
                            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-xl px-4 sm:px-6 h-10 sm:h-11 shadow-lg w-full sm:w-auto">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No matching trials found</h3>
                    <p className="text-gray-500">Try running the AI workflow for more comprehensive matching</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default MatchTrials