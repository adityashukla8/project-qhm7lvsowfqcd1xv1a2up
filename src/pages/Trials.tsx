import { useEffect, useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, Calendar, ExternalLink } from "lucide-react"
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
      trial.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTrials(filtered)
  }, [searchTerm, trials])

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
        <div className="gradient-bg-medical relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <header className="container-custom py-16">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20 rounded-xl p-2" />
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Clinical Trials</h1>
                <p className="text-blue-100 text-xl font-light">Browse available clinical trials</p>
              </div>
            </div>
          </header>
        </div>
        <main className="container-custom -mt-8 relative z-10">
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      <div className="gradient-bg-medical relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <header className="container-custom py-16 relative">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200" />
            <div className="animate-fade-in-up">
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Clinical Trials</h1>
              <p className="text-blue-100 text-xl font-light">Browse available clinical trials</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="container-custom -mt-16 relative z-10 pb-16">
        <div className="space-y-12 animate-fade-in-up">
          {/* Search Section */}
          <div className="glass-morphism rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-6 h-6 absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search trials by title, condition, or location..." 
                  className="pl-16 h-16 border-0 bg-white/80 shadow-lg rounded-2xl text-lg font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                {filteredTrials.length} of {trials.length} trials
              </div>
            </div>
          </div>

          {/* Trials Grid */}
          <div className="grid grid-cols-1 gap-8">
            {filteredTrials.map((trial, index) => (
              <Card key={trial.id} className="card-premium border-0 rounded-3xl overflow-hidden animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="pb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                        {trial.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3">
                        <Badge className={`${getPhaseColor(trial.phase || '')} border-0 font-bold px-4 py-2 text-sm rounded-xl`}>
                          {trial.phase}
                        </Badge>
                        <Badge className={`${getStatusColor(trial.status || '')} border-0 font-bold px-4 py-2 text-sm rounded-xl`}>
                          {trial.status}
                        </Badge>
                      </div>
                    </div>
                    <Link to={`/trials/${trial.id}`}>
                      <Button className="btn-primary-gradient text-white border-0 rounded-2xl px-8 h-14 text-lg font-bold">
                        <ExternalLink className="w-5 h-5 mr-3" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Condition</div>
                        <div className="font-bold text-gray-900 text-lg">{trial.condition}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Location</div>
                        <div className="font-bold text-gray-900 text-lg">{trial.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Matched Patients</div>
                        <div className="font-bold text-gray-900 text-lg">{trial.matched_patients_count || 0}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-sm text-gray-500 font-medium">
                      Trial ID: <span className="font-mono font-bold text-gray-700">{trial.trial_id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrials.length === 0 && (
            <Card className="card-premium border-0 rounded-3xl">
              <CardContent className="text-center py-24">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">No trials found</h3>
                <p className="text-gray-600 text-lg">
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