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
    summary: string
    clinical_recommendation: string
    revised_age_range: string
    eligibility_gain_estimate: string
    note: string
  }
  biomarker_optimization_result: {
    summary: string
    clinical_recommendation: string
    estimated_gain: string
    note: string
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

  const formatText = (text: string) => {
    // Handle markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/\[(.*?)\]/g, '<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">$1</span>') // Bracketed text
      .replace(/\n/g, '<br>') // Line breaks
  }

  const getOptimizationScore = (protocol: ProtocolDetailData) => {
    const ageGain = parseFloat(protocol.age_optimization_result.eligibility_gain_estimate.replace('%', '')) || 0
    const biomarkerGain = parseFloat(protocol.biomarker_optimization_result.estimated_gain.replace('%', '')) || 0
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
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div className="flex items-center gap-4">
                <Link to="/protocol-optimization">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Protocols
                  </Button>
                </Link>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{id} Protocol Optimization Details</h1>
                <p className="text-purple-100 text-base sm:text-lg">Loading optimization analysis...</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-8">
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
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div className="flex items-center gap-4">
                <Link to="/protocol-optimization">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Protocols
                  </Button>
                </Link>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{id} Protocol Optimization Details</h1>
                <p className="text-purple-100 text-base sm:text-lg">Error loading optimization analysis</p>
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
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/20" />
              <div className="flex items-center gap-4">
                <Link to="/protocol-optimization">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Protocols
                  </Button>
                </Link>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Protocol Not Found</h1>
                <p className="text-purple-100 text-base sm:text-lg">The requested protocol could not be found</p>
              </div>
            </div>
          </header>
        </div>
        
        <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-8">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="bg-purple-600">
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/20" />
            <div className="flex items-center gap-4">
              <Link to="/protocol-optimization">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Protocols
                </Button>
              </Link>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{id} Protocol Optimization Details</h1>
              <p className="text-purple-100 text-base sm:text-lg">Detailed optimization analysis and recommendations</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getScoreColor(optimizationScore)} border font-medium px-4 py-2 text-lg`}>
                {optimizationScore.toFixed(1)}% Total Potential Gain
              </Badge>
            </div>
          </div>
        </header>
      </div>
      
      <main className="p-4 sm:p-8 -mt-4 relative z-10 max-w-6xl mx-auto">
        <div className="space-y-6 animate-slide-up">
          {/* Summary Overview */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Optimization Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatText(protocol.summary) }}
                />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Analysis generated on {formatDate(protocol.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Age Optimization */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Age Optimization Analysis
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium px-3 py-1">
                  {protocol.age_optimization_result.eligibility_gain_estimate} Potential Gain
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Revised Age Range
                      </h4>
                      <p className="text-lg font-bold text-blue-700">
                        {protocol.age_optimization_result.revised_age_range}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                      <div 
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: formatText(protocol.age_optimization_result.summary) }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Clinical Recommendation
                      </h4>
                      <div 
                        className="text-sm text-green-700"
                        dangerouslySetInnerHTML={{ __html: formatText(protocol.age_optimization_result.clinical_recommendation) }}
                      />
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Important Note</h4>
                      <div 
                        className="text-sm text-yellow-700"
                        dangerouslySetInnerHTML={{ __html: formatText(protocol.age_optimization_result.note) }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Biomarker Optimization */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                Biomarker Optimization Analysis
                <Badge className="bg-green-100 text-green-800 border-green-200 font-medium px-3 py-1">
                  {protocol.biomarker_optimization_result.estimated_gain} Potential Gain
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                      <div 
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: formatText(protocol.biomarker_optimization_result.summary) }}
                      />
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Clinical Recommendation
                      </h4>
                      <div 
                        className="text-sm text-green-700"
                        dangerouslySetInnerHTML={{ __html: formatText(protocol.biomarker_optimization_result.clinical_recommendation) }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Important Note</h4>
                      <div 
                        className="text-sm text-yellow-700"
                        dangerouslySetInnerHTML={{ __html: formatText(protocol.biomarker_optimization_result.note) }}
                      />
                    </div>
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