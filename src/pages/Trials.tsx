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
      case 'Phase 1': return 'bg-blue-100 text-blue-800'
      case 'Phase 2': return 'bg-green-100 text-green-800'
      case 'Phase 3': return 'bg-yellow-100 text-yellow-800'
      case 'Phase 4': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clinical Trials</h1>
              <p className="text-gray-600">Browse available clinical trials</p>
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinical Trials</h1>
            <p className="text-gray-600">Browse available clinical trials</p>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search trials by title, condition, or location..." 
                className="pl-10 w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredTrials.length} of {trials.length} trials
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredTrials.map((trial) => (
              <Card key={trial.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                        {trial.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getPhaseColor(trial.phase || '')}>
                          {trial.phase}
                        </Badge>
                        <Badge className={getStatusColor(trial.status || '')}>
                          {trial.status}
                        </Badge>
                      </div>
                    </div>
                    <Link to={`/trials/${trial.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Condition: {trial.condition}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Location: {trial.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {trial.matched_patients_count || 0} matched patients
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Trial ID: {trial.trial_id}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrials.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2 text-gray-900">No trials found</h3>
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