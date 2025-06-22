import { useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, MapPin, Users, ExternalLink } from "lucide-react"
import { Trial } from '@/entities'
import { Link } from 'react-router-dom'

interface TrialData extends Trial {
  id: string
}

const MatchTrials = () => {
  const [patientData, setPatientData] = useState({
    patientId: '',
    age: '',
    gender: '',
    condition: '',
    medicalHistory: ''
  })
  const [matchingResults, setMatchingResults] = useState<TrialData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFindTrials = async () => {
    if (!patientData.condition.trim()) {
      alert('Please enter a medical condition to search for trials')
      return
    }

    setIsSearching(true)
    setHasSearched(false)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Fetch all trials and filter by condition
      const allTrials = await Trial.list()
      const matchedTrials = allTrials.filter(trial => 
        trial.condition?.toLowerCase().includes(patientData.condition.toLowerCase()) ||
        trial.title?.toLowerCase().includes(patientData.condition.toLowerCase())
      )
      
      setMatchingResults(matchedTrials)
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
      case 'recruiting': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Match Trials</h1>
            <p className="text-gray-600">Find suitable clinical trials for patients</p>
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input 
                    id="patientId" 
                    placeholder="Enter patient ID"
                    value={patientData.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="Patient age"
                    value={patientData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input 
                    id="gender" 
                    placeholder="Male/Female/Other"
                    value={patientData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Primary Condition *</Label>
                  <Input 
                    id="condition" 
                    placeholder="Medical condition"
                    value={patientData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea 
                  id="medicalHistory" 
                  placeholder="Enter detailed medical history, current medications, and relevant clinical information..."
                  rows={4}
                  value={patientData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="flex items-center gap-2"
                  onClick={handleFindTrials}
                  disabled={isSearching}
                >
                  <Search className="w-4 h-4" />
                  {isSearching ? 'Searching...' : 'Find Matching Trials'}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Patient File
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Matching Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching for matching clinical trials...</p>
                </div>
              ) : hasSearched ? (
                matchingResults.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Found {matchingResults.length} matching trial{matchingResults.length !== 1 ? 's' : ''}
                    </div>
                    {matchingResults.map((trial) => (
                      <div key={trial.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{trial.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
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
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Condition:</span>
                            <span>{trial.condition}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{trial.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{trial.matched_patients_count || 0} patients currently matched</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Trial ID: {trial.trial_id}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No matching trials found</h3>
                    <p>No clinical trials match the specified condition. Try adjusting the search criteria.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter patient information above to find matching clinical trials</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default MatchTrials