import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, TrendingUp, Users, Calendar, ChevronRight, Loader2, AlertCircle, ChevronDown, ChevronUp, Settings, ExternalLink } from "lucide-react"
import { fetchProtocols } from '@/functions'

interface ProtocolData {
  trial_id: string
  summary: string
  age_optimization_result: {
    quantitative: {
      eligible_patients: number
      missed_patients: number
      missed_due_to_upper_limit: number
      missed_due_to_lower_limit: number
      suggested_upper_bound: number | null
      suggested_lower_bound: number | null
      current_range: string
      suggested_range: string
      total_patients: number
    }
    llm_insight: {
      summary: string
      clinical_recommendation: string
      revised_age_range: string
      eligibility_gain_estimate: string
      note: string
    }
  }
  biomarker_optimization_result: {
    summary: string
    suggested_biomarker_criteria: string
    gain_estimate: string
    clinical_note: string
  }
  created_at: string
}

const ProtocolOptimization = () => {
  const location = useLocation()
  const [protocols, setProtocols] = useState<ProtocolData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWorkflowExpanded, setIsWorkflowExpanded] = useState(false)

  useEffect(() => {
    fetchProtocolData()
  }, [])

  // Refresh data when navigating to this page (e.g., from optimize protocol button)
  useEffect(() => {
    fetchProtocolData()
  }, [location.pathname])

  const fetchProtocolData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Fetching protocol optimization data...')
      const response = await fetchProtocols({})
      console.log('Protocol response:', response)
      
      if (response.success && response.data) {
        setProtocols(response.data)
      } else {
        setError(response.error || 'Failed to fetch protocol data')
      }
    } catch (err) {
      console.error('Error fetching protocols:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const parseSummary = (summaryString: string) => {
    try {
      // The summary appears to be a stringified array
      const parsed = JSON.parse(summaryString)
      if (Array.isArray(parsed)) {
        // Clean up the text by removing markdown formatting and brackets
        return parsed.map(item => 
          item.replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/\[|\]/g, '')
            .trim()
        ).filter(item => item.length > 0)
      }
      return [summaryString.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\[|\]/g, '').trim()]
    } catch {
      return [summaryString.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\[|\]/g, '').trim()]
    }
  }

  const getOptimizationScore = (protocol: ProtocolData) => {
    const ageGain = parseFloat(protocol.age_optimization_result.llm_insight.eligibility_gain_estimate.replace('%', '')) || 0
    const biomarkerGain = protocol.biomarker_optimization_result.gain_estimate.match(/(\d+)-(\d+)%/)
    const avgBiomarkerGain = biomarkerGain ? (parseInt(biomarkerGain[1]) + parseInt(biomarkerGain[2])) / 2 : 0
    
    return ageGain + avgBiomarkerGain
  }

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'bg-green-100 text-green-800 border-green-200'
    if (score > 0) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleImageClick = () => {
    window.open('https://github.com/adityashukla8/clinicaltrials-multiagent/blob/master/assets/Clinical%20Trial%20Protocol%20Optimization%20Workflow.png', '_blank', 'noopener,noreferrer')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="bg-blue-600">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Protocol Optimization</h1>
                <p className="text-blue-100 text-base sm:text-lg">Optimize clinical trial protocols for better patient eligibility</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Loading protocol optimization data...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="bg-blue-600">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Protocol Optimization</h1>
                <p className="text-blue-100 text-base sm:text-lg">Optimize clinical trial protocols for better patient eligibility</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Error Loading Data</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={fetchProtocolData} className="bg-blue-600 hover:bg-blue-700">
                    Try Again
                  </Button>
                </div>
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
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Protocol Optimization</h1>
              <p className="text-blue-100 text-base sm:text-lg">Optimize clinical trial protocols for better patient eligibility</p>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-6xl mx-auto">
        <div className="space-y-6 animate-slide-up">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{protocols.length}</p>
                    <p className="text-sm text-gray-600">Total Protocols</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {protocols.filter(p => getOptimizationScore(p) >= 10).length}
                    </p>
                    <p className="text-sm text-gray-600">High Optimization Potential</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(protocols.reduce((sum, p) => sum + getOptimizationScore(p), 0) / protocols.length) || 0}%
                    </p>
                    <p className="text-sm text-gray-600">Avg. Potential Gain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocol Optimization Workflow */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Protocol Optimization Workflow
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsWorkflowExpanded(!isWorkflowExpanded)}
                  className="text-blue-700 hover:bg-blue-100"
                >
                  {isWorkflowExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show Workflow
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {isWorkflowExpanded && (
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div 
                    className="cursor-pointer group relative inline-block"
                    onClick={handleImageClick}
                  >
                    <img 
                      src="https://github.com/adityashukla8/clinicaltrials-multiagent/blob/master/assets/Clinical%20Trial%20Protocol%20Optimization%20Workflow.png?raw=true"
                      alt="Clinical Trial Protocol Optimization Workflow"
                      className="w-full h-auto rounded-lg shadow-md border border-gray-200 transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-lg"
                      style={{ maxHeight: '600px', objectFit: 'contain' }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-3 shadow-lg">
                        <ExternalLink className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Complete workflow diagram showing the protocol optimization process
                    <br />
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline" onClick={handleImageClick}>
                      Click to view source repository
                    </span>
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Protocols List */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="text-lg sm:text-xl">Protocol Optimization Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {protocols.map((protocol, index) => {
                  const optimizationScore = getOptimizationScore(protocol)
                  const summaryItems = parseSummary(protocol.summary)
                  
                  return (
                    <div key={protocol.trial_id} className="border-b border-gray-100 last:border-b-0">
                      <Link 
                        to={`/protocol-optimization/${protocol.trial_id}`}
                        className="block p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">{protocol.trial_id}</h3>
                              <Badge className={`${getScoreColor(optimizationScore)} border font-medium px-3 py-1`}>
                                {optimizationScore.toFixed(1)}% Potential Gain
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {protocol.age_optimization_result.quantitative.eligible_patients} eligible patients
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  Age: {protocol.age_optimization_result.llm_insight.eligibility_gain_estimate}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {formatDate(protocol.created_at)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {summaryItems[0]}
                            </p>
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ProtocolOptimization