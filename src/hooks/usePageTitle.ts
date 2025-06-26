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
        default:
          if (pathname.startsWith('/trials/')) {
            return `${baseTitle} - Trial Details`
          }
          return baseTitle
      }
    }

    document.title = getPageTitle(location.pathname)
  }, [location.pathname])
}

export default usePageTitle