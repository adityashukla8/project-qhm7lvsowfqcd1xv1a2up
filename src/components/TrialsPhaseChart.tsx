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
    <Card className="col-span-1 card-premium border-0 rounded-3xl overflow-hidden group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">
            Trials by Phase
          </CardTitle>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Activity className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} trials`, 'Count']}
                labelStyle={{ color: '#374151', fontWeight: '700', fontSize: '14px' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  padding: '16px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={48}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>
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