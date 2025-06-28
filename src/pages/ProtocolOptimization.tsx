import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Search, FileText, Clock, CheckCircle, AlertCircle, Eye, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProtocolOptimizationWorkflowSection from "@/components/ProtocolOptimizationWorkflowSection"

interface ProtocolOptimization {
  id: string
  trial_id: string
  title: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  age_eligibility_insights?: string
  biomarker_eligibility_insights?: string
  confidence_score?: number
}

const ProtocolOptimization = () => {
  const [optimizations, setOptimizations] = useState<ProtocolOptimization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchOptimizations()
  }, [])

  const fetchOptimizations = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/search-protocols')
      
      if (!response.ok) {
        throw new Error('Failed to fetch protocol optimizations')
      }
      
      const data = await response.json()
      console.log('Protocol optimizations data:', data)
      
      // Transform the data to match our interface
      const transformedData = data.map((item: any) => ({
        id: item.trial_id || item.id,
        trial_id: item.trial_id || item.id,
        title: item.title || `Protocol Optimization ${item.trial_id || item.id}`,
        status: item.status || 'completed',
        created_at: item.created_at || new Date().toISOString(),
        age_eligibility_insights: item.age_eligibility_insights,
        biomarker_eligibility_insights: item.biomarker_eligibility_insights,
        confidence_score: item.confidence_score
      }))
      
      setOptimizations(transformedData)
    } catch (error) {
      console.error('Error fetching protocol optimizations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch protocol optimizations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredOptimizations = optimizations.filter(opt =>
    opt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.trial_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (optimizationId: string) => {
    navigate(`/protocol-optimization/${optimizationId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Protocol Optimization
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            AI-powered insights to optimize clinical trial protocols for better patient eligibility and recruitment
          </p>
        </div>

        {/* Workflow Section */}
        <ProtocolOptimizationWorkflowSection />

        {/* Search */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search protocol optimizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-0 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading protocol optimizations...</p>
            </div>
          ) : filteredOptimizations.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Protocol Optimizations Found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No protocol optimizations are available at the moment.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredOptimizations.map((optimization) => (
                <Card key={optimization.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl text-gray-800 flex items-center gap-3">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          {optimization.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <strong>Trial ID:</strong> {optimization.trial_id}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(optimization.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(optimization.status)} flex items-center gap-1`}>
                          {getStatusIcon(optimization.status)}
                          {optimization.status.charAt(0).toUpperCase() + optimization.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {optimization.age_eligibility_insights && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Age Eligibility Insights</h4>
                          <p className="text-blue-700 text-sm">{optimization.age_eligibility_insights}</p>
                        </div>
                      )}
                      
                      {optimization.biomarker_eligibility_insights && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-2">Biomarker Eligibility Insights</h4>
                          <p className="text-purple-700 text-sm">{optimization.biomarker_eligibility_insights}</p>
                        </div>
                      )}
                      
                      {optimization.confidence_score && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Confidence Score:</span>
                          <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                            {(optimization.confidence_score * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={() => handleViewDetails(optimization.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProtocolOptimization