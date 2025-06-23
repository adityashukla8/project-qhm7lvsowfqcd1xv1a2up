import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from 'lucide-react'

interface PhaseData {
  name: string
  value: number
  color: string
}

interface TrialsPhaseChartProps {
  data: PhaseData[]
}

const COLORS = {
  'Phase 1': '#3B82F6',
  'Phase 2': '#10B981',
  'Phase 3': '#F59E0B',
  'Phase 4': '#EF4444'
}

export function TrialsPhaseChart({ data }: TrialsPhaseChartProps) {
  const chartData = data.map(item => ({
    ...item,
    color: COLORS[item.name as keyof typeof COLORS] || '#6B7280'
  }))

  return (
    <Card className="col-span-1 card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Trials by Phase
          </CardTitle>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} trials`, 'Count']}
                labelStyle={{ color: '#374151', fontWeight: '600' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span style={{ color: '#374151', fontSize: '12px', fontWeight: '500' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}