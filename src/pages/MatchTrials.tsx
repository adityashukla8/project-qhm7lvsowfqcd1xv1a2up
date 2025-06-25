import { useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, ExternalLink, Calendar, User, Activity, CheckCircle, XCircle } from "lucide-react"
import { Link } from 'react-router-dom'
import { fetchPatients, matchTrials, trialInfo } from '@/functions'
import EligibilityText from '@/components/EligibilityText'
import { useToast } from "@/hooks/use-toast"
import WorkflowModal from '@/components/WorkflowModal'
import { ChatButton } from '@/components/ChatButton'

interface PatientData {
  id: string
  patient_id: string
  patient_name: string
  condition: string
  chemotherapy: string[]
  radiotherapy: string[]
  age: number
  gender: string[]
  country: string
  metastasis: string[]
  histology: string
  biomarker: string
  ecog_score: number
  condition_recurrence: string[]
  status: string
  matched: boolean
  matched_trials_count: number
}

interface TrialInfoResult {
  trial_id: string
  match_criteria: string
  reason: string
  match_requirements: string
  title: string
  phase: string
  condition: string
  status: string
  location: string
  eligibility: string
  source_url: string
}

const MatchTrials = () => {
  const [patientId, setPatientId] = useState('')
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [matchingResults, setMatchingResults] = useState<TrialInfoResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isFetchingPatient, setIsFetchingPatient] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const handleFetchPatient = async () => {
    if (!patientId.trim()) {
      alert('Please enter a patient ID')
      return
    }

    setIsFetchingPatient(true)
    try {
      console.log('Fetching patient with ID:', patientId.trim())
      const response = await fetchPatients({ patientId: patientId.trim() })
      console.log('API Response:', response)
      
      if (response.success && response.patient) {
        console.log('Patient found:', response.patient)
        setPatientData(response.patient)
      } else {
        console.error('Patient not found or API error:', response)
        alert(`Patient not found: ${response.error || 'Unknown error'}`)
        setPatientData(null)
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
      alert(`Error fetching patient data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsFetchingPatient(false)
    }
  }

  const handleFindTrials = async () => {
    if (!patientData) {
      alert('Please fetch patient data first')
      return
    }

    setIsSearching(true)
    setHasSearched(false)

    try {
      console.log('Calling match trials API for patient:', patientData.patient_id)
      
      const notificationTimer = setTimeout(() => {
        toast({
          title: " AI Processing Update",
          description: (
            <div className="text-sm">
              Trials fetched, triggering <strong className="font-semibold text-green-700">AI-driven eligibility matching</strong>.
            </div>
          ),
          duration: 5000,
          className: "bg-green-50 border border-green-300 text-green-800", // green toast styling
        })
      }, 15000)


      const matchResponse = await matchTrials({ patient_id: patientData.patient_id })
      console.log('Match trials response:', matchResponse)

      // Clear the timer if the API completes before 15 seconds
      clearTimeout(notificationTimer)

      if (matchResponse.success) {
        console.log('Match trials completed, now fetching trial info...')
        
        // Call trial_info API after matchtrials completes
        const trialInfoResponse = await trialInfo({ patient_id: patientData.patient_id })
        console.log('Trial info response:', trialInfoResponse)
        
        if (trialInfoResponse.success && trialInfoResponse.trials) {
          setMatchingResults(trialInfoResponse.trials)
        } else {
          console.error('Trial info API error:', trialInfoResponse)
          setMatchingResults([])
        }
      } else {
        console.error('Match trials API error:', matchResponse)
        setMatchingResults([])
      }
      
      setHasSearched(true)
    } catch (error) {
      console.error('Error finding matching trials:', error)
      setMatchingResults([])
      setHasSearched(true)
    } finally {
      setIsSearching(false)
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Phase 1': return 'bg-blue-100 text-blue-800'
      case 'Phase 2': return 'bg-green-100 text-green-800'
      case 'Phase 3': return 'bg-yellow-100 text-yellow-800'
      case 'Phase 4': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recruiting': return 'bg-green-100 text-green-800'
      case 'Active': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMatchCriteriaColor = (criteria: string) => {
    switch (criteria.toLowerCase()) {
      case 'match': return 'bg-green-100 text-green-800 border-green-200'
      case 'partial match': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'no match': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMatchIcon = (criteria: string) => {
    return criteria.toLowerCase() === 'match' ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-blue-600">
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Match Trials</h1>
                <p className="text-blue-100 text-base sm:text-lg">Find suitable clinical trials for patients</p>
              </div>
            </div>
            <WorkflowModal />
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
            <CardContent className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="patientId" className="text-sm font-semibold text-gray-700">Patient ID</Label>
                  <Input 
                    id="patientId" 
                    placeholder="Enter patient ID to search (e.g., P001, P002, etc.)"
                    className="h-10 sm:h-12 border-0 bg-gray-50 rounded-xl"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-xl px-6 h-10 sm:h-12 shadow-lg w-full sm:w-auto"
                    onClick={handleFetchPatient}
                    disabled={isFetchingPatient}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isFetchingPatient ? 'Searching...' : 'Fetch Patient'}
                  </Button>
                </div>
              </div>
              {!patientData && !isFetchingPatient && (
                <div className="text-sm text-gray-600 bg-blue-50 px-4 py-3 rounded-lg">
                  <strong>Tip:</strong> Try patient IDs like P001, P002, P003, etc. Make sure the patient exists in the external API.
                </div>
              )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Patient Name</Label>
                    <p className="font-medium text-gray-900">{patientData.patient_name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Age</Label>
                    <p className="font-medium text-gray-900">{patientData.age}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Gender</Label>
                    <p className="font-medium text-gray-900">{Array.isArray(patientData.gender) ? patientData.gender.join(', ') : patientData.gender}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Condition</Label>
                    <p className="font-medium text-gray-900">{patientData.condition}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Country</Label>
                    <p className="font-medium text-gray-900">{patientData.country}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">ECOG Score</Label>
                    <p className="font-medium text-gray-900">{patientData.ecog_score}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Histology</Label>
                    <p className="font-medium text-gray-900">{patientData.histology}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Biomarker</Label>
                    <p className="font-medium text-gray-900">{patientData.biomarker}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Chemotherapy</Label>
                    <p className="font-medium text-gray-900">{Array.isArray(patientData.chemotherapy) ? patientData.chemotherapy.join(', ') : patientData.chemotherapy}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Radiotherapy</Label>
                    <p className="font-medium text-gray-900">{Array.isArray(patientData.radiotherapy) ? patientData.radiotherapy.join(', ') : patientData.radiotherapy}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Metastasis</Label>
                    <p className="font-medium text-gray-900">{Array.isArray(patientData.metastasis) ? patientData.metastasis.join(', ') : patientData.metastasis}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Condition Recurrence</Label>
                    <p className="font-medium text-gray-900">{Array.isArray(patientData.condition_recurrence) ? patientData.condition_recurrence.join(', ') : patientData.condition_recurrence}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-xl px-6 h-10 sm:h-12 shadow-lg"
                    onClick={handleFindTrials}
                    disabled={isSearching}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {isSearching ? 'Finding Trials...' : 'Match Clinical Trials'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Matching Results */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
              <CardTitle className="text-lg sm:text-xl">Matching Results</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Finding matching clinical trials...</p>
                  <p className="text-gray-500 text-sm mt-2">Processing match criteria and fetching trial details...</p>
                </div>
              ) : hasSearched ? (
                matchingResults.length > 0 ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
                      Found {matchingResults.length} matching trial{matchingResults.length !== 1 ? 's' : ''}
                    </div>
                    {matchingResults.map((trial, index) => (
                      <div key={trial.trial_id} className="border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                              {trial.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className={`${getPhaseColor(trial.phase)} border font-medium px-3 py-1`}> 
                                {trial.phase}
                              </Badge>
                              <Badge className={`${getStatusColor(trial.status)} border font-medium px-3 py-1`}> 
                                {trial.status}
                              </Badge>
                              <Badge className={`${getMatchCriteriaColor(trial.match_criteria)} border font-medium px-3 py-1`}> 
                                {trial.match_criteria}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              {getMatchIcon(trial.match_criteria)}
                              <span className={`text-sm font-medium ${trial.match_criteria.toLowerCase() === 'match' ? 'text-green-700' : 'text-red-700'}`}>
                                {trial.reason}
                              </span>
                            </div>
                            <div className="space-y-3 mb-3">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm font-semibold text-blue-900 mb-2">Match Requirements:</div>
                                <EligibilityText 
                                  text={trial.match_requirements} 
                                  maxItems={3}
                                  maxChars={250}
                                />
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-semibold text-gray-900 mb-2">Eligibility Criteria:</div>
                                <EligibilityText 
                                  text={trial.eligibility} 
                                  maxItems={4}
                                  maxChars={300}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {trial.source_url && (
                              <a href={trial.source_url} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-xl px-4 sm:px-6 h-10 sm:h-11 shadow-lg w-full">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View on ClinicalTrials.gov
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Condition</div>
                              <div className="font-medium text-gray-900">{trial.condition}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Location</div>
                              <div className="font-medium text-gray-900">{trial.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Trial ID</div>
                              <div className="font-medium text-gray-900 font-mono">{trial.trial_id}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">No matching trials found</h3>
                    <p className="text-gray-500">No clinical trials match this patient's criteria.</p>
                  </div>
                )
              )
              : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Ready to find trials</h3>
                  <p className="text-gray-500">Search for a patient by ID to find matching clinical trials</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <ChatButton />
    </div>
  )
}

export default MatchTrials
