import { useState, useEffect } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, User, Activity } from "lucide-react"
import { fetchPatients } from '@/functions'

interface Patient {
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

const PatientInfo = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(patient =>
        patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPatients(filtered)
    }
  }, [searchTerm, patients])

  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchPatients({})
      
      if (response.success && response.patients) {
        const patientsArray = Array.isArray(response.patients) ? response.patients : []
        setPatients(patientsArray)
        setFilteredPatients(patientsArray)
      } else {
        setError(response.error || 'Failed to load patients')
      }
    } catch (error) {
      console.error('Error loading patients:', error)
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="bg-blue-600">
          <header className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20 p-2" />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Patient Information</h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1">View and search patient data</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-6 lg:p-8 -mt-2 sm:-mt-4 relative z-10">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="bg-blue-600">
          <header className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20 p-2" />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Patient Information</h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1">View and search patient data</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-6 lg:p-8 -mt-2 sm:-mt-4 relative z-10">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <p>Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-blue-600">
        <header className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20 p-2" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Patient Information</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1">View and search patient data</p>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">{filteredPatients.length} patients</span>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-6 lg:p-8 -mt-2 sm:-mt-4 relative z-10">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Patients
            </CardTitle>
            <CardDescription>
              Search by patient name, ID, condition, or country
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{patient.patient_name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                </div>
                <CardDescription>ID: {patient.patient_id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Age:</span>
                    <p>{patient.age}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Gender:</span>
                    <p>{Array.isArray(patient.gender) ? patient.gender.join(', ') : patient.gender}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Country:</span>
                    <p>{patient.country}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">ECOG Score:</span>
                    <p>{patient.ecog_score}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Condition:</span>
                  <p className="text-sm mt-1">{patient.condition}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Histology:</span>
                  <p className="text-sm mt-1">{patient.histology}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Biomarker:</span>
                  <p className="text-sm mt-1">{patient.biomarker}</p>
                </div>
                
                {patient.chemotherapy && patient.chemotherapy.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">Chemotherapy:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.chemotherapy.map((chemo, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {chemo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.radiotherapy && patient.radiotherapy.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">Radiotherapy:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.radiotherapy.map((radio, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {radio}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.metastasis && patient.metastasis.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">Metastasis:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.metastasis.map((meta, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {meta}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.matched && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      {patient.matched_trials_count} trial matches
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredPatients.length === 0 && !loading && (
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No patients found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'No patients available in the system.'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default PatientInfo