import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Location state interface
interface LocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  timestamp: number | null
  isLoading: boolean
  error: string | null
}

// Location actions interface
interface LocationActions {
  setLocation: (lat: number, lng: number, accuracy?: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetLocation: () => void
  getCurrentLocation: () => Promise<void>
}

// Combined store type
type LocationStore = LocationState & LocationActions

// Initial state
const initialState: LocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  timestamp: null,
  isLoading: false,
  error: null,
}

// Create the store with persistence
export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Set location coordinates
      setLocation: (latitude: number, longitude: number, accuracy?: number) => {
        set({
          latitude,
          longitude,
          accuracy: accuracy || null,
          timestamp: Date.now(),
          error: null,
        })
      },

      // Set loading state
      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      // Reset location to initial state
      resetLocation: () => {
        set(initialState)
      },

      // Get current location using Geolocation API
      getCurrentLocation: async () => {
        const { setLoading, setError, setLocation } = get()

        // Check if geolocation is supported
        if (!navigator.geolocation) {
          setError('Geolocation is not supported by this browser')
          return
        }

        setLoading(true)
        setError(null)

        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000, // Cache for 1 minute
            })
          })

          const { latitude, longitude, accuracy } = position.coords
          setLocation(latitude, longitude, accuracy)
        } catch (error) {
          let errorMessage = 'Failed to get location'
          
          if (error instanceof GeolocationPositionError) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location permission denied'
                break
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable'
                break
              case error.TIMEOUT:
                errorMessage = 'Location request timed out'
                break
              default:
                errorMessage = 'Unknown location error'
            }
          } else if (error instanceof Error) {
            errorMessage = error.message
          }

          setError(errorMessage)
        } finally {
          setLoading(false)
        }
      },
    }),
    {
      name: 'location-storage', // localStorage key
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        accuracy: state.accuracy,
        timestamp: state.timestamp,
      }),
    }
  )
)

// Selector hooks for better performance
export const useLocation = () => useLocationStore((state) => ({
  latitude: state.latitude,
  longitude: state.longitude,
  accuracy: state.accuracy,
  timestamp: state.timestamp,
}))

export const useLocationStatus = () => useLocationStore((state) => ({
  isLoading: state.isLoading,
  error: state.error,
}))

export const useLocationActions = () => useLocationStore((state) => ({
  setLocation: state.setLocation,
  setLoading: state.setLoading,
  setError: state.setError,
  resetLocation: state.resetLocation,
  getCurrentLocation: state.getCurrentLocation,
}))

// Individual selectors for better performance and to avoid infinite loops
export const useLatitude = () => useLocationStore((state) => state.latitude)
export const useLongitude = () => useLocationStore((state) => state.longitude)
export const useAccuracy = () => useLocationStore((state) => state.accuracy)
export const useTimestamp = () => useLocationStore((state) => state.timestamp)
export const useIsLoading = () => useLocationStore((state) => state.isLoading)
export const useError = () => useLocationStore((state) => state.error)
