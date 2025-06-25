import { useEffect, useState } from 'react'
import { Users, Activity, FileText, Target, TrendingUp, Search } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { fetchMetrics } from '@/functions'

interface MetricsData {
  total_patients: number
  total_trials: number
  total_patients_scanned: number
  patients_with_match: number
  total_matched_trials: number
  avg_trials_scanned_per_patient: number
  match_rate_percent: number
  top_matched_conditions: Array<[string, number]>
  trials_enriched: number
  avg_tavily_citations_per_trial: number
}

export function MetricsOverview() {
  const [data, setData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        console.log('Fetching dashboard metrics...')
        const response = await fetchMetrics({})
        console.log('Metrics Response:', response)
        
        if (response.success && response.metrics) {
          setData(response.metrics)
        } else {
          console.warn('Failed to fetch metrics:', response.error)
        }
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardMetrics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load metrics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Patient Metrics */}
      <div className="animate-slide-up">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Metrics</h2>
          <p className="text-gray-600">Patient processing and scanning statistics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Patients"
            value={data.total_patients}
            icon={Users}
            subtitle="In database"
          />
          <MetricCard
            title="Patients Scanned"
            value={data.total_patients_scanned}
            icon={Search}
            subtitle="Processed for matching"
          />
          <MetricCard
            title="Patients with Matches"
            value={data.patients_with_match}
            icon={Target}
            subtitle="Successfully matched"
          />
        </div>
      </div>

      {/* Trial Metrics */}
      <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trial Metrics</h2>
          <p className="text-gray-600">Clinical trial database and enrichment statistics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Trials"
            value={data.total_trials}
            icon={FileText}
            subtitle="Available trials"
          />
          <MetricCard
            title="Trials Enriched"
            value={data.trials_enriched}
            icon={TrendingUp}
            subtitle="Enhanced with AI"
          />
          <MetricCard
            title="Avg Citations per Trial"
            value={data.avg_tavily_citations_per_trial.toFixed(1)}
            icon={FileText}
            subtitle="Research citations"
          />
        </div>
      </div>

      {/* Matching Performance */}
      <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Matching Performance</h2>
          <p className="text-gray-600">Patient-trial matching efficiency and success rates</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Match Rate"
            value={`${data.match_rate_percent.toFixed(1)}%`}
            icon={Target}
            subtitle="Success rate"
          />
          <MetricCard
            title="Total Matched Trials"
            value={data.total_matched_trials}
            icon={Activity}
            subtitle="Successful matches"
          />
          <MetricCard
            title="Avg Trials per Patient"
            value={data.avg_trials_scanned_per_patient.toFixed(1)}
            icon={Search}
            subtitle="Trials scanned"
          />
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Top Conditions</h3>
                <p className="text-sm text-gray-600">Most matched</p>
              </div>
            </div>
            <div className="space-y-3">
              {data.top_matched_conditions.map(([condition, count], index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-700 font-medium truncate">{condition}</span>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}