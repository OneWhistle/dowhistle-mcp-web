import { useEffect } from 'react'
import { useLocationStore } from '../stores/locationStore'

/**
 * Hook to automatically get user location on component mount
 * Only triggers if no location data exists
 */
export const useLocationOnMount = () => {
  const latitude = useLocationStore((state) => state.latitude)
  const longitude = useLocationStore((state) => state.longitude)
  const getCurrentLocation = useLocationStore((state) => state.getCurrentLocation)

  useEffect(() => {
    // Only get location if we don't have coordinates
    if (latitude === null && longitude === null) {
      getCurrentLocation()
    }
  }, []) // Empty dependency array - only run once on mount
}

/**
 * Hook to get user location on app load with optional auto-refresh
 * @param autoRefresh - Whether to automatically refresh location every 5 minutes
 */
export const useLocationWithAutoRefresh = (autoRefresh: boolean = false) => {
  const getCurrentLocation = useLocationStore((state) => state.getCurrentLocation)

  useEffect(() => {
    // Get initial location if none exists
    getCurrentLocation()

    // Set up auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        getCurrentLocation()
      }, 5 * 60 * 1000) // 5 minutes

      return () => clearInterval(interval)
    }
  }, [getCurrentLocation, autoRefresh])
}
