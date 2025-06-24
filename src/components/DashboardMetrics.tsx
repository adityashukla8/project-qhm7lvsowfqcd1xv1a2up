import { useEffect, useState } from 'react'
import { Users, Activity, FileText, Clock, Bot, Wrench, Target } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { TrialsPhaseChart } from './TrialsPhaseChart'
import { fetchPatients } from '@/functions'

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
        // Fetch patients data from API
        const patientsResponse = await fetchPatients({})
        
        if (patientsResponse.success && patientsResponse.patients) {
          const patients = patientsResponse.patients
          const totalPatients = patients.length
          const matchedPatients = patients.filter(p => p.matched).length
          const unmatchedPatients = totalPatients - matchedPatients
          const matchRate = totalPatients > 0 ? (matchedPatients / totalPatients) * 100 : 0

          // Calculate average trials per patient
          const totalMatches = patients.reduce((sum, p) => sum + (p.matched_trials_count || 0), 0)
          const avgTrialsPerPatient = totalPatients > 0 ? totalMatches / totalPatients : 0

          setData(prevData => ({
            ...prevData,
            totalPatients,
            matchedPatients,
            unmatchedPatients,
            matchRate,
            avgTrialsPerPatient
          }))
        }

        // Set some default values for other metrics (these would come from other APIs)
        setData(prevData => ({
          ...prevData,
          totalTrials: 150, // This would come from trials API
          trialsPhaseData: [
            { name: 'Phase 1', value: 25, color: '#3B82F6' },
            { name: 'Phase 2', value: 45, color: '#10B981' },
            { name: 'Phase 3', value: 60, color: '#F59E0B' },
            { name: 'Phase 4', value: 20, color: '#EF4444' }
          ],
          enrichedSummaries: 89,
          avgResponseTime: 245,
          agentCount: 12,
          toolCount: 8
        }))

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
    <div className="space-y-6 sm:space-y-8">
      {/* ... keep existing code (all the metric sections remain the same) ... */}
    </div>
  )
}