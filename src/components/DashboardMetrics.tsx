import { useEffect, useState } from 'react'
import { Users, Activity, FileText, Clock, Bot, Wrench } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { TrialsPhaseChart } from './TrialsPhaseChart'
import { Patient } from '@/entities'
import { Trial } from '@/entities'
import { Summary } from '@/entities'
import { ProcessingMetric } from '@/entities'

interface DashboardData {
  totalPatients: number
  matchedPatients: number
  unmatchedPatients: number
  matchRate: number
  totalTrials: number
  avgTrialsPerPatient: number
  trialsPhaseData: Array<{ name: string; value: number; color: string }>
  enrichedSummaries: number
  avgResponseTime: number
  agentCount: number
  toolCount: number
}

export function DashboardMetrics() {
  const [data, setData] = useState<DashboardData>({
    totalPatients: 0,
    matchedPatients: 0,
    unmatchedPatients: 0,
    matchRate: 0,
    totalTrials: 0,
    avgTrialsPerPatient: 0,
    trialsPhaseData: [],
    enrichedSummaries: 0,
    avgResponseTime: 0,
    agentCount: 0,
    toolCount: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch patients data
        const patients = await Patient.list()
        const totalPatients = patients.length
        const matchedPatients = patients.filter(p => p.matched).length
        const unmatchedPatients = totalPatients - matchedPatients
        const matchRate = totalPatients > 0 ? (matchedPatients / totalPatients) * 100 : 0

        // Fetch trials data
        const trials = await Trial.list()
        const totalTrials = trials.length
        
        // Calculate average trials per patient
        const totalMatches = patients.reduce((sum, p) => sum + (p.matched_trials_count || 0), 0)
        const avgTrialsPerPatient = totalPatients > 0 ? totalMatches / totalPatients : 0

        // Calculate trials by phase
        const phaseGroups = trials.reduce((acc, trial) => {
          const phase = trial.phase || 'Unknown'
          acc[phase] = (acc[phase] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const trialsPhaseData = Object.entries(phaseGroups).map(([name, value]) => ({
          name,
          value,
          color: ''
        }))

        // Fetch summaries
        const summaries = await Summary.list()
        const enrichedSummaries = summaries.length

        // Fetch processing metrics
        const metrics = await ProcessingMetric.list()
        const responseTimeMetrics = metrics.filter(m => m.metric_type === 'api_response_time')
        const avgResponseTime = responseTimeMetrics.length > 0 
          ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) / responseTimeMetrics.length 
          : 0

        const agentMetrics = metrics.filter(m => m.metric_type === 'agent_count')
        const agentCount = agentMetrics.length > 0 ? agentMetrics[agentMetrics.length - 1].value : 0

        const toolMetrics = metrics.filter(m => m.metric_type === 'tool_count')
        const toolCount = toolMetrics.length > 0 ? toolMetrics[toolMetrics.length - 1].value : 0

        setData({
          totalPatients,
          matchedPatients,
          unmatchedPatients,
          matchRate,
          totalTrials,
          avgTrialsPerPatient,
          trialsPhaseData,
          enrichedSummaries,
          avgResponseTime,
          agentCount,
          toolCount
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Patients Section */}
      <div className="animate-slide-up">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Analytics</h2>
          <p className="text-gray-600">Real-time patient matching performance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Patients"
            value={data.totalPatients}
            icon={Users}
            subtitle="Processed patients"
          />
          <MetricCard
            title="Matched Patients"
            value={data.matchedPatients}
            icon={Users}
            subtitle="Successfully matched"
          />
          <MetricCard
            title="Unmatched Patients"
            value={data.unmatchedPatients}
            icon={Users}
            subtitle="No matches found"
          />
          <MetricCard
            title="Match Rate"
            value={`${data.matchRate.toFixed(1)}%`}
            icon={Activity}
            subtitle="Success rate"
          />
        </div>
      </div>

      {/* Trials Section */}
      <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trial Insights</h2>
          <p className="text-gray-600">Clinical trial distribution and matching efficiency</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Trials"
            value={data.totalTrials}
            icon={FileText}
            subtitle="Available trials"
          />
          <MetricCard
            title="Avg Trials per Patient"
            value={data.avgTrialsPerPatient.toFixed(1)}
            icon={Activity}
            subtitle="Match efficiency"
          />
          <TrialsPhaseChart data={data.trialsPhaseData} />
        </div>
      </div>

      {/* System Performance Section */}
      <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System Performance</h2>
          <p className="text-gray-600">AI agents and processing capabilities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Enriched Summaries"
            value={data.enrichedSummaries}
            icon={FileText}
            subtitle="Generated summaries"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${data.avgResponseTime.toFixed(0)}ms`}
            icon={Clock}
            subtitle="API performance"
          />
          <MetricCard
            title="Active Agents"
            value={data.agentCount}
            icon={Bot}
            subtitle="Multi-agent system"
          />
          <MetricCard
            title="Available Tools"
            value={data.toolCount}
            icon={Wrench}
            subtitle="System capabilities"
          />
        </div>
      </div>
    </div>
  )
}