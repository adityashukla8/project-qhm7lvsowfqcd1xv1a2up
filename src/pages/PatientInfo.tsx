import { useEffect, useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, User, Activity } from "lucide-react"
import { fetchPatients } from '@/functions'

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

const PatientInfo = () => {
  const [patients, setPatients] = useState<PatientData[]>([])
  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await fetchPatients({})
        if (response.success && response.patients) {
          setPatients(response.patients)
          setFilteredPatients(response.patients)
        }
      } catch (error) {
        console.error('Error loading patients:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.country?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(filtered)
  }, [searchTerm, patients])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
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
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Patient Information</h1>
                <p className="text-blue-100 text-base sm:text-lg">Manage patient data and profiles</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="gradient-bg-medical">
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Patient Information</h1>
              <p className="text-blue-100 text-base sm:text-lg">Manage patient data and profiles</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10">
        <div className="space-y-6 sm:space-y-8 animate-slide-up">
          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search patients by name, ID, condition..." 
                  className="pl-12 h-10 sm:h-12 border-0 bg-white shadow-sm rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                {filteredPatients.length} of {patients.length} patients
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Patient List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Patient Registry</h2>
              {filteredPatients.length > 0 ? (
                <div className="space-y-4">
                  {filteredPatients.map((patient, index) => (
                    <Card 
                      key={patient.id || patient.patient_id} 
                      className={`card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 animate-slide-up ${
                        selectedPatient?.patient_id === patient.patient_id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{animationDelay: `${index * 0.1}s`}}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{patient.patient_name}</h3>
                              <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(patient.status || '')} border font-medium px-3 py-1`}>
                            {patient.status || 'Unknown'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Age:</span>
                            <span className="ml-2 font-medium">{patient.age}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Country:</span>
                            <span className="ml-2 font-medium">{patient.country}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Condition:</span>
                            <span className="ml-2 font-medium">{patient.condition}</span>
                          </div>
                        </div>
                        
                        {patient.matched && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Activity className="w-4 h-4" />
                              <span>{patient.matched_trials_count || 0} trials matched</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                  <CardContent className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No patients found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Try adjusting your search criteria' : 'No patients available in the system'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Patient Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
              {selectedPatient ? (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      {selectedPatient.patient_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-6">
                    {/* ... keep existing code (patient details sections) ... */}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                  <CardContent className="text-center py-12">
                    <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Select a patient</h3>
                    <p className="text-gray-500">Click on a patient from the list to view detailed information</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientInfo