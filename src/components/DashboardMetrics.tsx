import { MetricCard } from "./MetricCard"
import { TrialsPhaseChart } from "./TrialsPhaseChart"
import { Users, Activity, FileText, TrendingUp } from "lucide-react"
import { useAppWriteData } from '@/hooks/useAppWriteData'

interface PatientDocument {
  $id: string;
  status?: string;
  matched?: boolean;
}

interface TrialDocument {
  $id: string;
  phase?: string;
  status?: string;
}

interface MatchDocument {
  $id: string;
  patient_id: string;
  trial_id: string;
}

export function DashboardMetrics() {
  const { data: patients } = useAppWriteData<PatientDocument>({
    collection: 'patient_info_collection'
  });

  const { data: trials } = useAppWriteData<TrialDocument>({
    collection: 'trial_info'
  });

  const { data: matches } = useAppWriteData<MatchDocument>({
    collection: 'match_info'
  });

  // Calculate metrics
  const totalPatients = patients.length;
  const processedPatients = patients.filter(p => p.status === 'processed').length;
  const matchedPatients = patients.filter(p => p.matched === true).length;
  const totalTrials = trials.length;
  const activeTrials = trials.filter(t => t.status === 'recruiting' || t.status === 'active').length;
  const totalMatches = matches.length;

  // Calculate phase distribution
  const phaseData = [
    { name: 'Phase 1', value: trials.filter(t => t.phase === 'Phase 1').length, color: '#3B82F6' },
    { name: 'Phase 2', value: trials.filter(t => t.phase === 'Phase 2').length, color: '#10B981' },
    { name: 'Phase 3', value: trials.filter(t => t.phase === 'Phase 3').length, color: '#F59E0B' },
    { name: 'Phase 4', value: trials.filter(t => t.phase === 'Phase 4').length, color: '#EF4444' }
  ].filter(phase => phase.value > 0);

  const matchingRate = totalPatients > 0 ? Math.round((matchedPatients / totalPatients) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Patients"
          value={totalPatients}
          subtitle={`${processedPatients} processed`}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        
        <MetricCard
          title="Active Trials"
          value={activeTrials}
          subtitle={`${totalTrials} total trials`}
          icon={Activity}
          trend={{ value: 8, isPositive: true }}
        />
        
        <MetricCard
          title="Successful Matches"
          value={totalMatches}
          subtitle={`${matchedPatients} patients matched`}
          icon={FileText}
          trend={{ value: 15, isPositive: true }}
        />
        
        <MetricCard
          title="Matching Rate"
          value={`${matchingRate}%`}
          subtitle="Patient-trial compatibility"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <TrialsPhaseChart data={phaseData} />
        
        {/* Additional chart placeholder */}
        <div className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">New patients processed</span>
                <span className="font-semibold text-blue-600">{processedPatients}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Successful matches</span>
                <span className="font-semibold text-green-600">{totalMatches}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Active trials</span>
                <span className="font-semibold text-purple-600">{activeTrials}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}