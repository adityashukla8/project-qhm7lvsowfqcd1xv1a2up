import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ExternalLink, MapPin, Users, Calendar, Activity } from "lucide-react"
import { fetchTrials } from '@/functions'

interface TrialData {
  id: string
  trial_id: string
  title: string
  official_title: string
  phase: string
  condition: string
  status: string
  location: string
  source_url: string
  eligibility: string
  known_side_effects: string
  dsmc_presence: string
  enrollment_info: string
  objective_summary: string
  external_notes: string
  sponsor_info: string
  patient_experiences: string
  statistical_plan: string
  intervention_arms: string
  sample_size: string
  pre_req_for_participation: string
  sponsor_contact: string
  location_and_site_details: string
  monitoring_frequency: string
  safety_documents: string
  sites: string
  patient_faq_summary: string
  citations: string
  matched_patients_count: number
}

const Trials = () => {
  const [trials, setTrials] = useState<TrialData[]>([])
  const [filteredTrials, setFilteredTrials] = useState<TrialData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTrials = async () => {
      try {
        console.log('Fetching trials using backend function...')
        const response = await fetchTrials({})
        console.log('Backend function response:', response)
        
        if (response.success && response.trials) {
          // Ensure trials is an array
          const trialsArray = Array.isArray(response.trials) ? response.trials : []
          console.log('Trials array length:', trialsArray.length)
          
          setTrials(trialsArray)
          setFilteredTrials(trialsArray)
          setError(null)
        } else {
          console.error('Backend function error:', response)
          setError('Failed to fetch trials: ' + (response.error || 'Unknown error'))
          setTrials([])
          setFilteredTrials([])
        }
      } catch (error) {
        console.error('Error loading trials:', error)
        setError('Error loading trials: ' + (error instanceof Error ? error.message : 'Unknown error'))
        setTrials([])
        setFilteredTrials([])
      } finally {
        setLoading(false)
      }
    }

    loadTrials()
  }, [])

  useEffect(() => {
    if (Array.isArray(trials)) {
      let filtered = trials.filter(trial => {
        const matchesSearch = 
          trial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trial.trial_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trial.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trial.location?.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesPhase = phaseFilter === 'all' || trial.phase === phaseFilter
        const matchesStatus = statusFilter === 'all' || trial.status === statusFilter
        
        return matchesSearch && matchesPhase && matchesStatus
      })
      setFilteredTrials(filtered)
    }
  }, [searchTerm, phaseFilter, statusFilter, trials])

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Phase 1': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Phase 2': return 'bg-green-100 text-green-700 border-green-200'
      case 'Phase 3': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Phase 4': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'recruiting': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="bg-blue-600">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Clinical Trials</h1>
                <p className="text-blue-100 text-base sm:text-lg">Explore available clinical trials</p>
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
        <div className="bg-blue-600">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Clinical Trials</h1>
                <p className="text-blue-100 text-base sm:text-lg">Explore available clinical trials</p>
              </div>
            </div>
          </header>
        </div>
        <main className="p-4 sm:p-8 -mt-4 relative z-10">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Error Loading Trials</h3>
              <p className="text-gray-500">{error}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-blue-600">
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Clinical Trials</h1>
              <p className="text-blue-100 text-base sm:text-lg">Explore available clinical trials</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10">
        <div className="space-y-6 sm:space-y-8 animate-slide-up">
          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search trials by title, ID, condition, location..." 
                  className="pl-12 h-10 sm:h-12 border-0 bg-white shadow-sm rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                    <SelectTrigger className="w-32 border-0 bg-white shadow-sm rounded-xl">
                      <SelectValue placeholder="Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Phases</SelectItem>
                      <SelectItem value="Phase 1">Phase 1</SelectItem>
                      <SelectItem value="Phase 2">Phase 2</SelectItem>
                      <SelectItem value="Phase 3">Phase 3</SelectItem>
                      <SelectItem value="Phase 4">Phase 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 border-0 bg-white shadow-sm rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="recruiting">Recruiting</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg whitespace-nowrap">
                  {filteredTrials.length} of {trials.length} trials
                </div>
              </div>
            </div>
          </div>

          {/* Trials Grid */}
          {filteredTrials.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTrials.map((trial, index) => (
                <Card 
                  key={trial.id || trial.trial_id} 
                  className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Badge className={`${getPhaseColor(trial.phase || '')} border font-medium px-3 py-1 text-xs`}>
                        {trial.phase || 'Unknown Phase'}
                      </Badge>
                      <Badge className={`${getStatusColor(trial.status || '')} border font-medium px-3 py-1 text-xs`}>
                        {trial.status || 'Unknown'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {trial.title || 'Untitled Trial'}
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium">ID: {trial.trial_id}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Condition</p>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{trial.condition || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{trial.location || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      {trial.matched_patients_count !== undefined && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Matched Patients</p>
                            <p className="text-sm font-medium text-gray-900">{trial.matched_patients_count}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex gap-2">
                      <Button asChild size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Link to={`/trials/${trial.trial_id}`}>
                          View Details
                        </Link>
                      </Button>
                      {trial.source_url && (
                        <Button asChild variant="outline" size="sm" className="border-gray-200">
                          <a href={trial.source_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent className="text-center py-12">
                <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No trials found</h3>
                <p className="text-gray-500">
                  {searchTerm || phaseFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria or filters' 
                    : 'No trials available in the system'}
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