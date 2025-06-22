import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Trials by Phase
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} trials`, 'Count']}
                labelStyle={{ color: '#374151' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span style={{ color: '#374151', fontSize: '12px' }}>
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