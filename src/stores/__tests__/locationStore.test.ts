import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLocationStore } from '../locationStore'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
}
Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

describe('Location Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useLocationStore.setState({
      latitude: null,
      longitude: null,
      accuracy: null,
      timestamp: null,
      isLoading: false,
      error: null,
    })
    
    // Clear mocks
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useLocationStore.getState()
      
      expect(state.latitude).toBeNull()
      expect(state.longitude).toBeNull()
      expect(state.accuracy).toBeNull()
      expect(state.timestamp).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Actions', () => {
    it('should set location correctly', () => {
      const { setLocation } = useLocationStore.getState()
      
      setLocation(40.7128, -74.0060, 10)
      
      const state = useLocationStore.getState()
      expect(state.latitude).toBe(40.7128)
      expect(state.longitude).toBe(-74.0060)
      expect(state.accuracy).toBe(10)
      expect(state.timestamp).toBeGreaterThan(0)
      expect(state.error).toBeNull()
    })

    it('should set loading state', () => {
      const { setLoading } = useLocationStore.getState()
      
      setLoading(true)
      expect(useLocationStore.getState().isLoading).toBe(true)
      
      setLoading(false)
      expect(useLocationStore.getState().isLoading).toBe(false)
    })

    it('should set error state', () => {
      const { setError } = useLocationStore.getState()
      
      setError('Test error')
      const state = useLocationStore.getState()
      expect(state.error).toBe('Test error')
      expect(state.isLoading).toBe(false)
    })

    it('should reset location to initial state', () => {
      const { setLocation, resetLocation } = useLocationStore.getState()
      
      // Set some location data
      setLocation(40.7128, -74.0060)
      expect(useLocationStore.getState().latitude).toBe(40.7128)
      
      // Reset
      resetLocation()
      const state = useLocationStore.getState()
      expect(state.latitude).toBeNull()
      expect(state.longitude).toBeNull()
      expect(state.accuracy).toBeNull()
      expect(state.timestamp).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Geolocation Integration', () => {
    it('should handle successful geolocation', async () => {
      const mockPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 15,
        },
      }
      
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition)
      })
      
      const { getCurrentLocation } = useLocationStore.getState()
      await getCurrentLocation()
      
      const state = useLocationStore.getState()
      expect(state.latitude).toBe(40.7128)
      expect(state.longitude).toBe(-74.0060)
      expect(state.accuracy).toBe(15)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle geolocation errors gracefully', async () => {
      const mockError = new Error('Test error')
      
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError)
      })
      
      const { getCurrentLocation } = useLocationStore.getState()
      await getCurrentLocation()
      
      const state = useLocationStore.getState()
      expect(state.error).toBe('Test error')
      expect(state.isLoading).toBe(false)
    })

    it('should handle unsupported geolocation', async () => {
      // Remove geolocation support
      Object.defineProperty(navigator, 'geolocation', {
        value: undefined,
        writable: true,
      })
      
      const { getCurrentLocation } = useLocationStore.getState()
      await getCurrentLocation()
      
      const state = useLocationStore.getState()
      expect(state.error).toBe('Geolocation is not supported by this browser')
      expect(state.isLoading).toBe(false)
    })
  })

  describe('Selector Hooks', () => {
    it('should provide location data selector', () => {
      const { setLocation } = useLocationStore.getState()
      setLocation(40.7128, -74.0060, 10)
      
      // This would be used in a component
      const locationData = {
        latitude: useLocationStore.getState().latitude,
        longitude: useLocationStore.getState().longitude,
        accuracy: useLocationStore.getState().accuracy,
        timestamp: useLocationStore.getState().timestamp,
      }
      
      expect(locationData.latitude).toBe(40.7128)
      expect(locationData.longitude).toBe(-74.0060)
      expect(locationData.accuracy).toBe(10)
    })
  })
})
