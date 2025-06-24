import { useEffect, useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, User, Activity } from "lucide-react"
import { useAppWriteData } from '@/hooks/useAppWriteData'

interface PatientDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  patient_id: string;
  patient_name: string;
  condition: string;
  chemotherapy?: string[];
  radiotherapy?: string[];
  age: number;
  gender?: string[];
  country: string;
  metastasis?: string[];
  histology?: string;
  biomarker?: string;
  ecog_score?: number;
  condition_recurrence?: string[];
  status?: string;
  matched?: boolean;
  matched_trials_count?: number;
}

const PatientInfo = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<PatientDocument | null>(null)

  const {
    data: patients,
    loading,
    error,
    fetchData
  } = useAppWriteData<PatientDocument>({
    collection: 'patient_info_collection'
  });

  const filteredPatients = patients.filter(patient =>
    patient.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.country?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="gradient-bg-medical">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Patient Information</h1>
                <p className="text-blue-100 text-base sm:text-lg">Error loading patient data</p>
              </div>
            </div>
          </header>
        </div>
        <main className="p-4 sm:p-8 -mt-4 relative z-10">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium mb-2 text-red-600">Error Loading Data</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
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
                      key={patient.$id} 
                      className={`card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 animate-slide-up ${
                        selectedPatient?.$id === patient.$id ? 'ring-2 ring-blue-500' : ''
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
                    {/* Basic Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Patient ID</span>
                          <p className="font-medium text-gray-900">{selectedPatient.patient_id}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Age</span>
                          <p className="font-medium text-gray-900">{selectedPatient.age}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Gender</span>
                          <p className="font-medium text-gray-900">{Array.isArray(selectedPatient.gender) ? selectedPatient.gender.join(', ') : selectedPatient.gender}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Country</span>
                          <p className="font-medium text-gray-900">{selectedPatient.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Medical Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Condition</span>
                          <p className="font-medium text-gray-900">{selectedPatient.condition}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">ECOG Score</span>
                          <p className="font-medium text-gray-900">{selectedPatient.ecog_score}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Histology</span>
                          <p className="font-medium text-gray-900">{selectedPatient.histology}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Biomarker</span>
                          <p className="font-medium text-gray-900">{selectedPatient.biomarker}</p>
                        </div>
                      </div>
                    </div>

                    {/* Treatment Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Treatment Information</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Chemotherapy</span>
                          <p className="font-medium text-gray-900">{Array.isArray(selectedPatient.chemotherapy) ? selectedPatient.chemotherapy.join(', ') : selectedPatient.chemotherapy}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Radiotherapy</span>
                          <p className="font-medium text-gray-900">{Array.isArray(selectedPatient.radiotherapy) ? selectedPatient.radiotherapy.join(', ') : selectedPatient.radiotherapy}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Metastasis</span>
                          <p className="font-medium text-gray-900">{Array.isArray(selectedPatient.metastasis) ? selectedPatient.metastasis.join(', ') : selectedPatient.metastasis}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Condition Recurrence</span>
                          <p className="font-medium text-gray-900">{Array.isArray(selectedPatient.condition_recurrence) ? selectedPatient.condition_recurrence.join(', ') : selectedPatient.condition_recurrence}</p>
                        </div>
                      </div>
                    </div>

                    {/* Matching Status */}
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3">Matching Status</h4>
                      <div className="flex items-center gap-4">
                        <Badge className={`${getStatusColor(selectedPatient.status || '')} border font-medium px-3 py-1`}>
                          {selectedPatient.status || 'Unknown'}
                        </Badge>
                        {selectedPatient.matched && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Activity className="w-4 h-4" />
                            <span className="text-sm font-medium">{selectedPatient.matched_trials_count || 0} trials matched</span>
                          </div>
                        )}
                      </div>
                    </div>
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