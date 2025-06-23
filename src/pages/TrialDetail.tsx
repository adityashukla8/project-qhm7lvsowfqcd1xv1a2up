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
      case 'Phase 1': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Phase 2': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Phase 3': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Phase 4': return 'bg-rose-50 text-rose-700 border-rose-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'active': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'completed': return 'bg-slate-50 text-slate-700 border-slate-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const formatCitations = (citations: string) => {
    if (!citations) return null
    
    // Split citations by common delimiters and clean them up
    const citationList = citations.split(/[;,]/).map(citation => citation.trim()).filter(citation => citation.length > 0)
    
    return citationList.map((citation, index) => (
      <span key={index} className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium mr-2 mb-2 border border-blue-100 hover:shadow-sm transition-all duration-200">
        {citation}
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-8 py-6 shadow-sm">
          <div className="flex items-center gap-6">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Trial Details</h1>
              <p className="text-slate-600 mt-1">Loading trial information...</p>
            </div>
          </div>
        </header>
        <main className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!trial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-8 py-6 shadow-sm">
          <div className="flex items-center gap-6">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Trial Not Found</h1>
              <p className="text-slate-600 mt-1">The requested trial could not be found</p>
            </div>
          </div>
        </header>
        <main className="p-8">
          <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Trial Not Found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">The trial you're looking for doesn't exist or has been removed.</p>
              <Link to="/trials">
                <Button variant="outline" className="bg-white/50 hover:bg-white/80 border-white/30 backdrop-blur-sm">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-8 py-6 shadow-sm">
        <div className="flex items-center gap-6">
          <SidebarTrigger />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <Link to="/trials">
                <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/80 border-white/30 backdrop-blur-sm transition-all duration-200">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Trials
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-tight">{trial.title}</h1>
            <p className="text-slate-600 mt-2 font-medium">Trial ID: {trial.trial_id}</p>
          </div>
        </div>
      </header>
      
      <main className="p-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Trial Overview */}
          <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Trial Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Status & Phase</h3>
                    <div className="flex gap-3">
                      <Badge className={`${getPhaseColor(trial.phase || '')} border font-medium px-3 py-1.5`}>
                        {trial.phase}
                      </Badge>
                      <Badge className={`${getStatusColor(trial.status || '')} border font-medium px-3 py-1.5`}>
                        {trial.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Condition</h3>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{trial.condition}</span>
                    </div>
                  </div>
                  {trial.source_url && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Source</h3>
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-emerald-600" />
                        </div>
                        <a 
                          href={trial.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-200 hover:decoration-blue-300 transition-colors duration-200"
                        >
                          View Original Source
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Location</h3>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-rose-600" />
                      </div>
                      <span className="font-medium">{trial.location}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Matched Patients</h3>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium">{trial.matched_patients_count || 0} patients matched</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {trial.eligibility && (
                <div className="mt-8 pt-8 border-t border-slate-200/50">
                  <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Eligibility Criteria</h3>
                  <div className="bg-gradient-to-br from-slate-50/50 to-blue-50/30 p-6 rounded-2xl border border-slate-200/50">
                    <p className="text-slate-700 leading-relaxed">{trial.eligibility}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Summary Section */}
          <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Trial Details & Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {trial.official_title && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <FileText className="w-3 h-3 text-blue-600" />
                        </div>
                        Official Title
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.official_title}</p>
                    </div>
                  )}

                  {trial.known_side_effects && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-red-600" />
                        </div>
                        Known Side Effects
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.known_side_effects}</p>
                    </div>
                  )}

                  {trial.dsmc_presence && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-emerald-600" />
                        </div>
                        DSMC Presence
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.dsmc_presence}</p>
                    </div>
                  )}

                  {trial.enrollment_info && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                          <Users className="w-3 h-3 text-purple-600" />
                        </div>
                        Enrollment Info
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.enrollment_info}</p>
                    </div>
                  )}

                  {trial.objective_summary && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <Activity className="w-3 h-3 text-blue-600" />
                        </div>
                        Objective Summary
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.objective_summary}</p>
                    </div>
                  )}

                  {trial.external_notes && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                          <FileText className="w-3 h-3 text-slate-600" />
                        </div>
                        External Notes
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.external_notes}</p>
                    </div>
                  )}

                  {trial.sponsor_info && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <Building className="w-3 h-3 text-indigo-600" />
                        </div>
                        Sponsor Info
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.sponsor_info}</p>
                    </div>
                  )}

                  {trial.patient_experiences && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <Users className="w-3 h-3 text-emerald-600" />
                        </div>
                        Patient Experiences
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.patient_experiences}</p>
                    </div>
                  )}

                  {trial.statistical_plan && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                          <Activity className="w-3 h-3 text-orange-600" />
                        </div>
                        Statistical Plan
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.statistical_plan}</p>
                    </div>
                  )}

                  {trial.intervention_arms && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <Activity className="w-3 h-3 text-purple-600" />
                        </div>
                        Intervention Arms
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.intervention_arms}</p>
                    </div>
                  )}

                  {trial.sample_size && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          <Users className="w-3 h-3 text-blue-600" />
                        </div>
                        Sample Size
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.sample_size}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {trial.pre_req_for_participation && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
                          <FileText className="w-3 h-3 text-red-600" />
                        </div>
                        Prerequisites for Participation
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.pre_req_for_participation}</p>
                    </div>
                  )}

                  {trial.sponsor_contact && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <Building className="w-3 h-3 text-indigo-600" />
                        </div>
                        Sponsor Contact
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.sponsor_contact}</p>
                    </div>
                  )}

                  {trial.location_and_site_details && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                        </div>
                        Location and Site Details
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.location_and_site_details}</p>
                    </div>
                  )}

                  {trial.monitoring_frequency && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-orange-600" />
                        </div>
                        Monitoring Frequency
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.monitoring_frequency}</p>
                    </div>
                  )}

                  {trial.safety_documents && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-red-600" />
                        </div>
                        Safety Documents
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.safety_documents}</p>
                    </div>
                  )}

                  {trial.sites && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-blue-600" />
                        </div>
                        Sites
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.sites}</p>
                    </div>
                  )}

                  {trial.patient_faq_summary && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                          <BookOpen className="w-3 h-3 text-emerald-600" />
                        </div>
                        Patient FAQ Summary
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-9">{trial.patient_faq_summary}</p>
                    </div>
                  )}

                  {trial.citations && (
                    <div className="group">
                      <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-3 text-sm uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                          <BookOpen className="w-3 h-3 text-purple-600" />
                        </div>
                        Citations
                      </h4>
                      <div className="flex flex-wrap pl-9">
                        {formatCitations(trial.citations)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matched Patients */}
          <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Matched Patients ({matchedPatients.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {matchedPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedPatients.slice(0, 6).map((patient) => (
                    <div key={patient.id} className="bg-gradient-to-br from-white/50 to-slate-50/50 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                      <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-200">{patient.patient_name}</h4>
                      <div className="space-y-1 text-sm text-slate-600 mb-3">
                        <p><span className="font-medium">ID:</span> {patient.patient_id}</p>
                        <p><span className="font-medium">Age:</span> {patient.age}</p>
                        <p><span className="font-medium">Condition:</span> {patient.condition}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 font-medium">
                        {patient.matched_trials_count} matches
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Users className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-lg">No patients matched to this trial yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Summaries */}
          <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Generated Summaries ({summaries.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {summaries.length > 0 ? (
                <div className="space-y-6">
                  {summaries.map((summary) => (
                    <div key={summary.id} className="bg-gradient-to-br from-white/50 to-slate-50/50 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={summary.type === 'match_summary' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200' : 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200'}>
                          {summary.type?.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm font-medium text-slate-600 bg-slate-100/50 px-3 py-1 rounded-full">
                          Confidence: {((summary.confidence_score || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed mb-3">{summary.content}</p>
                      <p className="text-xs text-slate-500 font-medium">Patient ID: {summary.patient_id}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-lg">No summaries generated for this trial yet</p>
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