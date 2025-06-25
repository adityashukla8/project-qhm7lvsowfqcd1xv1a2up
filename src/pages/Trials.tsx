import { useEffect, useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, Calendar, ExternalLink, Globe, FileText } from "lucide-react"
import { Link } from 'react-router-dom'
import { fetchTrials } from '@/functions'
import EligibilityText from '@/components/EligibilityText'

interface TrialData {
  trial_id: string
  title?: string
  source_url?: string
  eligibility?: string
  official_title?: string
  known_side_effects?: string
  dsmc_presence?: string
  enrollment_info?: string
  objective_summary?: string
  external_notes?: string
  sponsor_info?: string
  patient_experiences?: string
  statistical_plan?: string
  intervention_arms?: string
  sample_size?: string
  pre_req_for_participation?: string
  sponsor_contact?: string
  location_and_site_details?: string
  monitoring_frequency?: string
  safety_documents?: string
  sites?: string
  patient_faq_summary?: string
  citations?: string
  matched_patients_count: number
}

const Trials = () => {
  const [trials, setTrials] = useState<TrialData[]>([])
  const [filteredTrials, setFilteredTrials] = useState<TrialData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTrials = async () => {
      try {
        setError(null)
        console.log('Starting to fetch trials...')
        const response = await fetchTrials()
        console.log('Fetch trials response:', response)
        
        if (response && response.success) {
          // Ensure data is an array
          const trialsData = Array.isArray(response.data) ? response.data : []
          console.log('Setting trials data:', trialsData)
          setTrials(trialsData)
          setFilteredTrials(trialsData)
        } else {
          console.error('Error fetching trials:', response?.error || 'Unknown error')
          setError(response?.error || 'Failed to fetch trials')
          // Set empty arrays as fallback
          setTrials([])
          setFilteredTrials([])
        }
      } catch (error) {
        console.error('Error fetching trials:', error)
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
        // Set empty arrays as fallback
        setTrials([])
        setFilteredTrials([])
      } finally {
        setLoading(false)
      }
    }

    loadTrials()
  }, [])

  useEffect(() => {
    // Ensure trials is always an array before filtering
    if (Array.isArray(trials)) {
      const filtered = trials.filter(trial =>
        trial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trial.official_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trial.sites?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trial.location_and_site_details?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTrials(filtered)
    } else {
      setFilteredTrials([])
    }
  }, [searchTerm, trials])

  // Helper function to extract phase from title or other fields
  const extractPhase = (trial: TrialData): string => {
    const text = `${trial.title || ''} ${trial.official_title || ''}`.toLowerCase()
    if (text.includes('phase 1') || text.includes('phase i')) return 'Phase 1'
    if (text.includes('phase 2') || text.includes('phase ii')) return 'Phase 2'
    if (text.includes('phase 3') || text.includes('phase iii')) return 'Phase 3'
    if (text.includes('phase 4') || text.includes('phase iv')) return 'Phase 4'
    return 'Unknown'
  }

  // Helper function to extract status from enrollment info
  const extractStatus = (trial: TrialData): string => {
    const enrollmentText = trial.enrollment_info?.toLowerCase() || ''
    if (enrollmentText.includes('recruiting') || enrollmentText.includes('enrolling')) return 'recruiting'
    if (enrollmentText.includes('active') || enrollmentText.includes('ongoing')) return 'active'
    if (enrollmentText.includes('completed') || enrollmentText.includes('finished')) return 'completed'
    return 'unknown'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="gradient-bg-medical">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Clinical Trials</h1>
                <p className="text-blue-100 text-base sm:text-lg">Browse available clinical trials</p>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="gradient-bg-medical">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Clinical Trials</h1>
                <p className="text-blue-100 text-base sm:text-lg">Browse available clinical trials</p>
              </div>
            </div>
          </header>
        </div>
        <main className="p-4 sm:p-8 -mt-4 relative z-10">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Error Loading Trials</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Clinical Trials</h1>
              <p className="text-blue-100 text-base sm:text-lg">Browse available clinical trials</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10">
        <div className="space-y-6 sm:space-y-8 animate-slide-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search trials by title, location, or sites..." 
                  className="pl-12 h-10 sm:h-12 border-0 bg-white shadow-sm rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                {Array.isArray(filteredTrials) ? filteredTrials.length : 0} of {Array.isArray(trials) ? trials.length : 0} trials
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {Array.isArray(filteredTrials) && filteredTrials.map((trial, index) => {
              const phase = extractPhase(trial)
              const status = extractStatus(trial)
              
              return (
                <Card key={trial.trial_id} className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                          {trial.title || 'Untitled Trial'}
                        </CardTitle>
                        {trial.official_title && trial.official_title !== trial.title && (
                          <p className="text-sm text-gray-600 mb-3">{trial.official_title}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getPhaseColor(phase)} border font-medium px-3 py-1`}>
                            {phase}
                          </Badge>
                          <Badge className={`${getStatusColor(status)} border font-medium px-3 py-1`}>
                            {status}
                          </Badge>
                        </div>
                      </div>
                      <Link to={`/trials/${trial.trial_id}`}>
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-xl px-4 sm:px-6 h-10 sm:h-11 shadow-lg w-full sm:w-auto">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* ... keep existing code (trial details display) ... */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {trial.objective_summary && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Objective</div>
                            <div className="font-medium text-sm line-clamp-2">{trial.objective_summary}</div>
                          </div>
                        </div>
                      )}
                      {trial.sites && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Sites</div>
                            <div className="font-medium text-sm line-clamp-2">{trial.sites}</div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Matched Patients</div>
                          <div className="font-medium text-sm">{trial.matched_patients_count || 0}</div>
                        </div>
                      </div>
                      {trial.source_url && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Source</div>
                            <a 
                              href={trial.source_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              View Source
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {trial.eligibility && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mt-1">
                            <FileText className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Eligibility Criteria</div>
                            <EligibilityText 
                              text={trial.eligibility} 
                              maxItems={3}
                              maxChars={200}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Trial ID: <span className="font-mono">{trial.trial_id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {Array.isArray(filteredTrials) && filteredTrials.length === 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No trials found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No clinical trials available'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default Trials