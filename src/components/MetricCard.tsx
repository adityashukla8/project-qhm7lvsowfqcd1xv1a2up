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
  const isBlueCard = className.includes('bg-gradient-to-br from-blue-500')
  
  return (
    <Card className={`${className} card-hover border-0 shadow-lg ${!isBlueCard ? 'bg-white/80 backdrop-blur-sm' : ''} rounded-2xl overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${isBlueCard ? 'text-blue-100' : 'text-gray-600'}`}>
          {title}
        </CardTitle>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${isBlueCard ? 'bg-white/20' : 'bg-gradient-to-r from-blue-500 to-blue-600'} rounded-xl flex items-center justify-center`}>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isBlueCard ? 'text-white' : 'text-white'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl sm:text-3xl font-bold mb-1 ${isBlueCard ? 'text-white' : 'text-gray-900'}`}>{value}</div>
        {subtitle && (
          <p className={`text-xs sm:text-sm ${isBlueCard ? 'text-blue-100' : 'text-gray-500'}`}>{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              trend.isPositive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
            <span className="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}