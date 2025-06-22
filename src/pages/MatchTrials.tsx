import { useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, MapPin, Users, ExternalLink, Calendar } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="gradient-bg-medical">
        <header className="px-6 py-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-3xl font-bold text-white">Match Trials</h1>
              <p className="text-blue-100 text-lg">Find suitable clinical trials for patients</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-8 -mt-4 relative z-10 max-w-6xl mx-auto">
        <div className="space-y-8 animate-slide-up">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientId" className="text-sm font-semibold text-gray-700">Patient ID</Label>
                  <Input 
                    id="patientId" 
                    placeholder="Enter patient ID"
                    className="h-12 border-0 bg-gray-50 rounded-xl"
                    value={patientData.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-semibold text-gray-700">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="Patient age"
                    className="h-12 border-0 bg-gray-50 rounded-xl"
                    value={patientData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
                  <Input 
                    id="gender" 
                    placeholder="Male/Female/Other"
                    className="h-12 border-0 bg-gray-50 rounded-xl"
                    value={patientData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-sm font-semibold text-gray-700">Primary Condition *</Label>
                  <Input 
                    id="condition" 
                    placeholder="Medical condition"
                    className="h-12 border-0 bg-gray-50 rounded-xl"
                    value={patientData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalHistory" className="text-sm font-semibold text-gray-700">Medical History</Label>
                <Textarea 
                  id="medicalHistory" 
                  placeholder="Enter detailed medical history, current medications, and relevant clinical information..."
                  rows={4}
                  className="border-0 bg-gray-50 rounded-xl resize-none"
                  value={patientData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-xl px-8 h-12 shadow-lg"
                  onClick={handleFindTrials}
                  disabled={isSearching}
                >
                  <Search className="w-5 h-5 mr-2" />
                  {isSearching ? 'Searching...' : 'Find Matching Trials'}
                </Button>
                <Button variant="outline" className="border-2 border-gray-200 hover:border-gray-300 rounded-xl px-8 h-12">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Patient File
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="text-xl">Matching Results</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Searching for matching clinical trials...</p>
                </div>
              ) : hasSearched ? (
                matchingResults.length > 0 ? (
                  <div className="space-y-6">
                    <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
                      Found {matchingResults.length} matching trial{matchingResults.length !== 1 ? 's' : ''}
                    </div>
                    {matchingResults.map((trial, index) => (
                      <div key={trial.id} className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{trial.title}</h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={`${getPhaseColor(trial.phase || '')} border font-medium px-3 py-1`}>
                                {trial.phase}
                              </Badge>
                              <Badge className={`${getStatusColor(trial.status || '')} border font-medium px-3 py-1`}>
                                {trial.status}
                              </Badge>
                            </div>
                          </div>
                          <Link to={`/trials/${trial.id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-xl px-6 h-11 shadow-lg">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Matched Patients</div>
                              <div className="font-medium text-gray-900">{trial.matched_patients_count || 0}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            Trial ID: <span className="font-mono">{trial.trial_id}</span>
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
                    <p className="text-gray-500">No clinical trials match the specified condition. Try adjusting the search criteria.</p>
                  </div>
                )
              )
              : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Ready to find trials</h3>
                  <p className="text-gray-500">Enter patient information above to find matching clinical trials</p>
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