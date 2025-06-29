import { useState } from 'react'
import { DashboardMetrics } from './DashboardMetrics'
import { ActiveAgentsModal } from './ActiveAgentsModal'

export function MetricsOverview() {
  const [isActiveAgentsModalOpen, setIsActiveAgentsModalOpen] = useState(false)

  const handleActiveAgentsClick = () => {
    setIsActiveAgentsModalOpen(true)
  }

  return (
    <>
      <DashboardMetrics onActiveAgentsClick={handleActiveAgentsClick} />
      <ActiveAgentsModal 
        isOpen={isActiveAgentsModalOpen} 
        onClose={() => setIsActiveAgentsModalOpen(false)} 
      />
    </>
  )
}