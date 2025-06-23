import { useEffect, useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, Calendar, ExternalLink, Globe, FileText, Filter } from "lucide-react"
import { Trial } from '@/entities'
import { Link } from 'react-router-dom'

interface TrialData extends Trial {
  id: string
}

const Trials = () => {
  const [trials, setTrials] = useState<TrialData[]>([])
  const [filteredTrials, setFilteredTrials] = useState<TrialData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrials = async () => {
      try {
        const trialsData = await Trial.list()
        setTrials(trialsData)
        setFilteredTrials(trialsData)
      } catch (error) {
        console.error('Error fetching trials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrials()
  }, [])

  useEffect(() => {
    const filtered = trials.filter(trial =>
      trial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.official_title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTrials(filtered)
  }, [searchTerm, trials])

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Phase 1': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300'
      case 'Phase 2': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300'
      case 'Phase 3': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300'
      case 'Phase 4': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300'
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300'
      case 'active': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300'
      case 'completed': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <div className="gradient-bg-medical relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl floating"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl floating-delayed"></div>
          </div>
          <header className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-300" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Clinical Trials</h1>
                <p className="text-blue-100 text-lg font-medium">Discover and explore available clinical trials</p>
              </div>
            </div>
          </header>
        </div>
        <main className="px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="gradient-bg-medical relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl floating-delayed"></div>
        </div>
        <header className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-300" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Clinical Trials</h1>
              <p className="text-blue-100 text-lg font-medium">Discover and explore available clinical trials</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div className="space-y-8 animate-slide-up">
          {/* Enhanced Search Section */}
          <Card className="glass-card border-0 shadow-modern-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search trials by title, condition, location, or keywords..." 
                    className="pl-12 h-12 border-0 bg-white/80 backdrop-blur-sm shadow-sm rounded-xl text-base focus-ring"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="btn-secondary h-12 px-6">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <div className="glass-subtle px-4 py-3 rounded-xl">
                    <div className="text-sm font-semibold text-gray-900">
                      {filteredTrials.length} of {trials.length}
                    </div>
                    <div className="text-xs text-gray-500">trials found</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Trials Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredTrials.map((trial, index) => (
              <Card key={trial.id} className="modern-card card-hover border-0 shadow-modern overflow-hidden animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div>
                        <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                          {trial.title}
                        </CardTitle>
                        {trial.official_title && trial.official_title !== trial.title && (
                          <p className="text-gray-600 text-base leading-relaxed">{trial.official_title}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Badge className={`${getPhaseColor(trial.phase || '')} border font-semibold px-4 py-2 rounded-xl shadow-sm`}>
                          {trial.phase}
                        </Badge>
                        <Badge className={`${getStatusColor(trial.status || '')} border font-semibold px-4 py-2 rounded-xl shadow-sm`}>
                          {trial.status}
                        </Badge>
                      </div>
                    </div>
                    <Link to={`/trials/${trial.id}`}>
                      <Button className="btn-primary h-12 px-8 shadow-lg">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition</div>
                        <div className="font-semibold text-gray-900 text-sm">{trial.condition}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</div>
                        <div className="font-semibold text-gray-900 text-sm">{trial.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Matched Patients</div>
                        <div className="font-semibold text-gray-900 text-sm">{trial.matched_patients_count || 0}</div>
                      </div>
                    </div>
                    {trial.source_url && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-sm">
                          <Globe className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</div>
                          <a 
                            href={trial.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:text-blue-800 text-sm underline transition-colors duration-200"
                          >
                            View Source
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {trial.eligibility && (
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Eligibility Criteria</div>
                          <p className="text-gray-700 leading-relaxed line-clamp-3">{trial.eligibility}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 font-medium">
                      Trial ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{trial.trial_id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrials.length === 0 && (
            <Card className="modern-card border-0 shadow-modern">
              <CardContent className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">No trials found</h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search criteria or browse all available trials' : 'No clinical trials are currently available in the system'}
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