import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const usePageTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const getPageTitle = (pathname: string) => {
      const baseTitle = 'Criteria-AI'
      
      switch (pathname) {
        case '/':
          return `${baseTitle} - Dashboard`
        case '/about':
          return `${baseTitle} - About`
        case '/match-trials':
          return `${baseTitle} - Match Trials`
        case '/trials':
          return `${baseTitle} - Clinical Trials`
        case '/patient-info':
          return `${baseTitle} - Patient Information`
        case '/protocol-optimization':
          return `${baseTitle} - Protocol Optimization`
        default:
          if (pathname.startsWith('/trials/')) {
            return `${baseTitle} - Trial Details`
          }
          if (pathname.startsWith('/protocol-optimization/')) {
            const trialId = pathname.split('/')[2]
            return `${baseTitle} - ${trialId} Protocol Optimization`
          }
          return baseTitle
      }
    }

    document.title = getPageTitle(location.pathname)
  }, [location.pathname])
}

export default usePageTitle