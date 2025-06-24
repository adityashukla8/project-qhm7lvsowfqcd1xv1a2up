import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  className?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  className = "",
  trend,
  trendValue 
}: MetricCardProps) {
  return (
    <Card className={`modern-card card-hover overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              className.includes('bg-gradient') 
                ? 'bg-white/20' 
                : 'bg-gradient-to-br from-blue-100 to-purple-100'
            }`}>
              <Icon className={`w-6 h-6 ${
                className.includes('text-white') 
                  ? 'text-white' 
                  : 'text-blue-600'
              }`} />
            </div>
          </div>
          {trend && trendValue && (
            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend === 'up' ? 'bg-green-100 text-green-700' :
              trend === 'down' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {trendValue}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${
            className.includes('text-white') 
              ? 'text-white' 
              : 'text-gradient'
          }`}>
            {value}
          </div>
          <div className={`text-sm font-medium ${
            className.includes('text-white') 
              ? 'text-white/80' 
              : 'text-gray-600'
          }`}>
            {title}
          </div>
          {subtitle && (
            <div className={`text-xs ${
              className.includes('text-white') 
                ? 'text-white/60' 
                : 'text-gray-500'
            }`}>
              {subtitle}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}