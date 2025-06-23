import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Users, Calendar, FileText, Activity, Globe, Shield, Building, Clock, BookOpen } from "lucide-react"
import { Trial, Patient, Summary } from '@/entities'

interface TrialData extends Trial {
  id: string
}

interface PatientData extends Patient {
  id: string
}

interface SummaryData extends Summary {
  id: string
}

const TrialDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [trial, setTrial] = useState<TrialData | null>(null)
  const [matchedPatients, setMatchedPatients] = useState<PatientData[]>([])
  const [summaries, setSummaries] = useState<SummaryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrialData = async () => {
      if (!id) return

      try {
        // Fetch trial details
        const trialData = await Trial.get(id)
        setTrial(trialData)

        // Fetch matched patients (this would normally be done via a proper relationship)
        const allPatients = await Patient.list()
        const patients = allPatients.filter(p => p.matched && p.matched_trials_count && p.matched_trials_count > 0)
        setMatchedPatients(patients)

        // Fetch summaries for this trial
        const allSummaries = await Summary.list()
        const trialSummaries = allSummaries.filter(s => s.trial_id === trialData.trial_id)
        setSummaries(trialSummaries)
      } catch (error) {
        console.error('Error fetching trial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrialData()
  }, [id])

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

  const formatCitations = (citations: string) => {
    if (!citations) return null
    
    // Split citations by common delimiters and clean them up
    const citationList = citations.split(/[;,]/).map(citation => citation.trim()).filter(citation => citation.length > 0)
    
    return citationList.map((citation, index) => (
      <span key={index} className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs mr-2 mb-1">
        {citation}
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trial Details</h1>
              <p className="text-gray-600">Loading trial information...</p>
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

  if (!trial) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trial Not Found</h1>
              <p className="text-gray-600">The requested trial could not be found</p>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2 text-gray-900">Trial Not Found</h3>
              <p className="text-gray-500 mb-4">The trial you're looking for doesn't exist or has been removed.</p>
              <Link to="/trials">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Trials
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <Link to="/trials">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Trials
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{trial.title}</h1>
            <p className="text-gray-600">Trial ID: {trial.trial_id}</p>
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          {/* Trial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Trial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Status & Phase</h3>
                    <div className="flex gap-2">
                      <Badge className={getPhaseColor(trial.phase || '')}>
                        {trial.phase}
                      </Badge>
                      <Badge className={getStatusColor(trial.status || '')}>
                        {trial.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Condition</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{trial.condition}</span>
                    </div>
                  </div>
                  {trial.source_url && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Source</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={trial.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View Original Source
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{trial.location}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Matched Patients</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{trial.matched_patients_count || 0} patients matched</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {trial.eligibility && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">Eligibility Criteria</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{trial.eligibility}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Trial Details & Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {trial.official_title && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Official Title
                      </h4>
                      <p className="text-gray-700">{trial.official_title}</p>
                    </div>
                  )}

                  {trial.known_side_effects && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-600" />
                        Known Side Effects
                      </h4>
                      <p className="text-gray-700">{trial.known_side_effects}</p>
                    </div>
                  )}

                  {trial.dsmc_presence && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        DSMC Presence
                      </h4>
                      <p className="text-gray-700">{trial.dsmc_presence}</p>
                    </div>
                  )}

                  {trial.enrollment_info && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        Enrollment Info
                      </h4>
                      <p className="text-gray-700">{trial.enrollment_info}</p>
                    </div>
                  )}

                  {trial.objective_summary && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        Objective Summary
                      </h4>
                      <p className="text-gray-700">{trial.objective_summary}</p>
                    </div>
                  )}

                  {trial.external_notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        External Notes
                      </h4>
                      <p className="text-gray-700">{trial.external_notes}</p>
                    </div>
                  )}

                  {trial.sponsor_info && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-600" />
                        Sponsor Info
                      </h4>
                      <p className="text-gray-700">{trial.sponsor_info}</p>
                    </div>
                  )}

                  {trial.patient_experiences && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        Patient Experiences
                      </h4>
                      <p className="text-gray-700">{trial.patient_experiences}</p>
                    </div>
                  )}

                  {trial.statistical_plan && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-orange-600" />
                        Statistical Plan
                      </h4>
                      <p className="text-gray-700">{trial.statistical_plan}</p>
                    </div>
                  )}

                  {trial.intervention_arms && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-600" />
                        Intervention Arms
                      </h4>
                      <p className="text-gray-700">{trial.intervention_arms}</p>
                    </div>
                  )}

                  {trial.sample_size && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        Sample Size
                      </h4>
                      <p className="text-gray-700">{trial.sample_size}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {trial.pre_req_for_participation && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-600" />
                        Prerequisites for Participation
                      </h4>
                      <p className="text-gray-700">{trial.pre_req_for_participation}</p>
                    </div>
                  )}

                  {trial.sponsor_contact && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-600" />
                        Sponsor Contact
                      </h4>
                      <p className="text-gray-700">{trial.sponsor_contact}</p>
                    </div>
                  )}

                  {trial.location_and_site_details && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        Location and Site Details
                      </h4>
                      <p className="text-gray-700">{trial.location_and_site_details}</p>
                    </div>
                  )}

                  {trial.monitoring_frequency && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        Monitoring Frequency
                      </h4>
                      <p className="text-gray-700">{trial.monitoring_frequency}</p>
                    </div>
                  )}

                  {trial.safety_documents && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-600" />
                        Safety Documents
                      </h4>
                      <p className="text-gray-700">{trial.safety_documents}</p>
                    </div>
                  )}

                  {trial.sites && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        Sites
                      </h4>
                      <p className="text-gray-700">{trial.sites}</p>
                    </div>
                  )}

                  {trial.patient_faq_summary && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-600" />
                        Patient FAQ Summary
                      </h4>
                      <p className="text-gray-700">{trial.patient_faq_summary}</p>
                    </div>
                  )}

                  {trial.citations && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        Citations
                      </h4>
                      <div className="flex flex-wrap">
                        {formatCitations(trial.citations)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matched Patients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Matched Patients ({matchedPatients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {matchedPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedPatients.slice(0, 6).map((patient) => (
                    <div key={patient.id} className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-900">{patient.patient_name}</h4>
                      <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
                      <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      <p className="text-sm text-gray-600">Condition: {patient.condition}</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        {patient.matched_trials_count} matches
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No patients matched to this trial yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Summaries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Generated Summaries ({summaries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summaries.length > 0 ? (
                <div className="space-y-4">
                  {summaries.map((summary) => (
                    <div key={summary.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={summary.type === 'match_summary' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                          {summary.type?.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Confidence: {((summary.confidence_score || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-gray-700">{summary.content}</p>
                      <p className="text-xs text-gray-500 mt-2">Patient ID: {summary.patient_id}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No summaries generated for this trial yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default TrialDetail