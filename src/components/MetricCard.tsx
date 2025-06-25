import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  className?: string
}

export function MetricCard({ title, value, icon: Icon, subtitle, className }: MetricCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1",
      className
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}