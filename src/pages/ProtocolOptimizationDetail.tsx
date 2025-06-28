import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, TrendingUp, Users, Calendar, Loader2, AlertCircle, FileText, Target, Lightbulb } from "lucide-react"
import { fetchProtocolDetail } from '@/functions'

interface ProtocolDetailData {
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

const ProtocolOptimizationDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [protocol, setProtocol] = useState<ProtocolDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProtocolDetailData(id)
    }
  }, [id])

  const fetchProtocolDetailData = async (trialId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Fetching protocol detail for:', trialId)
      const response = await fetchProtocolDetail({ trial_id: trialId })
      console.log('Protocol detail response:', response)
      
      if (response.success && response.data) {
        setProtocol(response.data)
      } else {
        setError(response.error || 'Failed to fetch protocol detail')
      }
    } catch (err) {
      console.error('Error fetching protocol detail:', err)
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
        return parsed.filter(item => item.trim().length > 0)
      }
      return [summaryString]
    } catch {
      return [summaryString]
    }
  }

  const formatText = (text: string) => {
    // Handle markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/\[(.*?)\]/g, '<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">$1</span>') // Bracketed text
      .replace(/\n/g, '<br>') // Line breaks
  }

  const getOptimizationScore = (protocol: ProtocolDetailData) => {
    const ageGain = parseFloat(protocol.age_optimization_result.llm_insight.eligibility_gain_estimate.replace('%', '')) || 0
    // Parse biomarker gain estimate (e.g., "20-30%" -> average of 25%)
    const biomarkerGainMatch = protocol.biomarker_optimization_result.gain_estimate.match(/(\d+)-(\d+)%/)
    const biomarkerGain = biomarkerGainMatch 
      ? (parseInt(biomarkerGainMatch[1]) + parseInt(biomarkerGainMatch[2])) / 2 
      : parseFloat(protocol.biomarker_optimization_result.gain_estimate.replace('%', '')) || 0
    
    return ageGain + biomarkerGain
  }

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 10) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="bg-purple-600">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white hover:bg-white/20" />
                <Link to="/protocol-optimization">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] touch-manipulation">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Back to Protocols</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">{id} Protocol Optimization Details</h1>
                <p className="text-purple-100 text-sm sm:text-base lg:text-lg">Loading optimization analysis...</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-full mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Loading protocol optimization details...</p>
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
        <div className="bg-purple-600">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white hover:bg-white/20" />
                <Link to="/protocol-optimization">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] touch-manipulation">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Back to Protocols</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">{id} Protocol Optimization Details</h1>
                <p className="text-purple-100 text-sm sm:text-base lg:text-lg">Error loading optimization analysis</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-full mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Error Loading Data</h3>
                  <p className="text-gray-600 mb-4 break-words">{error}</p>
                  <Button onClick={() => id && fetchProtocolDetailData(id)} className="bg-purple-600 hover:bg-purple-700">
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

  if (!protocol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="bg-purple-600">
          <header className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white hover:bg-white/20" />
                <Link to="/protocol-optimization">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] touch-manipulation">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Back to Protocols</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">Protocol Not Found</h1>
                <p className="text-purple-100 text-sm sm:text-base lg:text-lg">The requested protocol could not be found</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-full mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Protocol Not Found</h3>
                  <p className="text-gray-600 mb-4">The protocol optimization details you're looking for don't exist or have been removed.</p>
                  <Link to="/protocol-optimization">
                    <Button variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Protocols
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const optimizationScore = getOptimizationScore(protocol)
  const summaryItems = parseSummary(protocol.summary)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-purple-600">
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <Link to="/protocol-optimization">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] touch-manipulation">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Protocols</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">{id} Protocol Optimization Details</h1>
                <p className="text-purple-100 text-sm sm:text-base lg:text-lg">Detailed optimization analysis and recommendations</p>
              </div>
              <div className="flex items-center">
                <Badge className={`${getScoreColor(optimizationScore)} border font-medium px-3 py-2 text-sm sm:text-base break-words`}>
                  {optimizationScore.toFixed(1)}% Total Potential Gain
                </Badge>
              </div>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-full mx-auto overflow-hidden">
        <div className="space-y-6 animate-slide-up max-w-6xl mx-auto">
          {/* Summary Overview */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-3 text-base sm:text-lg lg:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="break-words">Optimization Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <ul className="space-y-3">
                  {summaryItems.map((item, index) => (
                    <li 
                      key={index}
                      className="text-gray-700 leading-relaxed flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="break-words min-w-0" dangerouslySetInnerHTML={{ __html: formatText(item) }} />
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">Analysis generated on {formatDate(protocol.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Age Optimization */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-base sm:text-lg lg:text-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="break-words">Age Optimization Analysis</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium px-3 py-1 w-fit">
                  {protocol.age_optimization_result.llm_insight.eligibility_gain_estimate} Potential Gain
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 flex-shrink-0" />
                        <span className="break-words">Current vs Suggested Age Range</span>
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700 break-words">
                          <strong>Current:</strong> {protocol.age_optimization_result.quantitative.current_range}
                        </p>
                        <p className="text-sm text-blue-700 break-words">
                          <strong>Suggested:</strong> {protocol.age_optimization_result.quantitative.suggested_range}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Patient Statistics</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="break-words">
                          <span className="text-gray-600">Eligible:</span>
                          <span className="font-medium ml-2">{protocol.age_optimization_result.quantitative.eligible_patients}</span>
                        </div>
                        <div className="break-words">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium ml-2">{protocol.age_optimization_result.quantitative.total_patients}</span>
                        </div>
                        <div className="break-words">
                          <span className="text-gray-600">Missed:</span>
                          <span className="font-medium ml-2">{protocol.age_optimization_result.quantitative.missed_patients}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 flex-shrink-0" />
                        <span className="break-words">Clinical Recommendation</span>
                      </h4>
                      <div 
                        className="text-sm text-green-700 break-words"
                        dangerouslySetInnerHTML={{ __html: formatText(protocol.age_optimization_result.llm_insight.clinical_recommendation) }}
                      />
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Important Note</h4>
                      <div 
                        className="text-sm text-yellow-700 break-words"
                        dangerouslySetInnerHTML={{ __html: formatText(protocol.age_optimization_result.llm_insight.note) }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Biomarker Optimization */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-4 sm:p-6">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-base sm:text-lg lg:text-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="break-words">Biomarker Optimization Analysis</span>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 font-medium px-3 py-1 w-fit">
                  {protocol.biomarker_optimization_result.gain_estimate.split('.')[0]} Potential Gain
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                    <div 
                      className="text-sm text-gray-700 break-words"
                      dangerouslySetInnerHTML={{ __html: formatText(protocol.biomarker_optimization_result.summary) }}
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Suggested Biomarker Criteria</h4>
                    <div 
                      className="text-sm text-blue-700 whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: formatText(protocol.biomarker_optimization_result.suggested_biomarker_criteria) }}
                    />
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Gain Estimate & Rationale</h4>
                    <div 
                      className="text-sm text-green-700 whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: formatText(protocol.biomarker_optimization_result.gain_estimate) }}
                    />
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Clinical Note</h4>
                    <div 
                      className="text-sm text-yellow-700 break-words"
                      dangerouslySetInnerHTML={{ __html: formatText(protocol.biomarker_optimization_result.clinical_note) }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ProtocolOptimizationDetail