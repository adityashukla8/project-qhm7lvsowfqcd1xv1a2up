import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, FileText, TrendingUp } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Patient, Trial, TrialMatch, ProcessingMetric } from "@/entities"

export function MetricsOverview() {
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => Patient.list()
  })

  const { data: trials } = useQuery({
    queryKey: ['trials'],
    queryFn: () => Trial.list()
  })

  const { data: matches } = useQuery({
    queryKey: ['trial-matches'],
    queryFn: () => TrialMatch.list()
  })

  const { data: metrics } = useQuery({
    queryKey: ['processing-metrics'],
    queryFn: () => ProcessingMetric.list()
  })

  const totalPatients = patients?.length || 0
  const totalTrials = trials?.length || 0
  const totalMatches = matches?.length || 0
  const avgResponseTime = metrics?.find(m => m.metric_type === 'api_response_time')?.value || 0

  const metricCards = [
    {
      title: "Total Patients",
      value: totalPatients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Trials",
      value: totalTrials,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Successful Matches",
      value: totalMatches,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Avg Response Time",
      value: `${avgResponseTime.toFixed(1)}ms`,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 truncate pr-2">
                {metric.title}
              </CardTitle>
              <div className={`${metric.bgColor} p-2 rounded-lg`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl sm:text-3xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-gray-800">System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                {((totalMatches / Math.max(totalPatients, 1)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Match Success Rate</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                {trials?.filter(t => t.status === 'active').length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Trials</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                {patients?.filter(p => p.status === 'processed').length || 0}
              </div>
              <div className="text-sm text-gray-600">Processed Patients</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}