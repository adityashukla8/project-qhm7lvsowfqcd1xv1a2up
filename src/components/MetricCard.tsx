import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  className = "" 
}: MetricCardProps) {
  return (
    <Card className={`${className} card-premium border-0 rounded-3xl overflow-hidden group`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{value}</div>
        {subtitle && (
          <p className="text-gray-600 font-medium">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
              trend.isPositive 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </div>
            <span className="text-xs text-gray-500 ml-3 font-medium">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}